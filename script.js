  class Ball {
            constructor(canvas) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                
                // Размер шарика
                this.radius = Math.random() * 8 + 3; // от 3 до 11px
                
                // Начальная позиция
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                
                // Скорость (медленнее для снежной физики)
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = Math.random() * 0.5 + 0.2; // преимущественно вниз
                
                // Ускорение (для плавных изменений)
                this.ax = 0;
                this.ay = 0;
                
                // Масса (влияет на инерцию)
                this.mass = this.radius * 0.5;
                
                // Сопротивление воздуха (замедление)
                this.damping = 0.98;
                
                // Цвет - темно-белый с прозрачностью
                this.alpha = Math.random() * 0.2 + 0.1;
                this.color = `rgba(220, 220, 220, ${this.alpha})`;
                
                // Время для случайных изменений направления
                this.directionChangeTimer = 0;
                this.directionChangeInterval = Math.random() * 200 + 100; // 100-300 кадров
            }
            
            applyForces() {
                // Случайные небольшие изменения направления (как ветер)
                this.directionChangeTimer++;
                if (this.directionChangeTimer > this.directionChangeInterval) {
                    this.ax += (Math.random() - 0.5) * 0.05;
                    this.ay += (Math.random() - 0.5) * 0.02;
                    this.directionChangeTimer = 0;
                    this.directionChangeInterval = Math.random() * 200 + 100;
                }
                
                // Легкая гравитация
                this.ay += 0.01;
                
                // Ограничение ускорения
                this.ax = Math.max(Math.min(this.ax, 0.1), -0.1);
                this.ay = Math.max(Math.min(this.ay, 0.05), -0.05);
            }
            
            update() {
                this.applyForces();
                
                // Обновление скорости с учетом ускорения и массы
                this.vx += this.ax / this.mass;
                this.vy += this.ay / this.mass;
                
                // Применение сопротивления воздуха
                this.vx *= this.damping;
                this.vy *= this.damping;
                
                // Ограничение максимальной скорости
                const maxSpeed = 1.5;
                this.vx = Math.max(Math.min(this.vx, maxSpeed), -maxSpeed);
                this.vy = Math.max(Math.min(this.vy, maxSpeed), -maxSpeed);
                
                // Обновление позиции
                this.x += this.vx;
                this.y += this.vy;
                
                // Отскок от боковых границ
                if (this.x - this.radius < 0) {
                    this.x = this.radius;
                    this.vx = Math.abs(this.vx) * 0.6;
                    this.ax = 0;
                } else if (this.x + this.radius > this.canvas.width) {
                    this.x = this.canvas.width - this.radius;
                    this.vx = -Math.abs(this.vx) * 0.6;
                    this.ax = 0;
                }
                
                // Отскок от верхней границы
                if (this.y - this.radius < 0) {
                    this.y = this.radius;
                    this.vy = Math.abs(this.vy) * 0.6;
                    this.ay = 0;
                }
                
                // Не отскакиваем от нижней границы - шары просто продолжают движение вниз
                // Они будут удалены в updateBalls() когда уйдут слишком далеко
                
                // Постепенное затухание ускорения
                this.ax *= 0.9;
                this.ay *= 0.9;
            }
            
            draw() {
                // Основной шар
                this.ctx.beginPath();
                this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = this.color;
                this.ctx.fill();
                
                // Легкое свечение
                this.ctx.beginPath();
                this.ctx.arc(this.x, this.y, this.radius * 1.8, 0, Math.PI * 2);
                const gradient = this.ctx.createRadialGradient(
                    this.x, this.y, this.radius,
                    this.x, this.y, this.radius * 1.8
                );
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'rgba(220, 220, 220, 0)');
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }
        }

        class BallAnimation {
            constructor() {
                this.canvas = document.getElementById('canvas');
                this.ctx = this.canvas.getContext('2d');
                this.balls = [];
                this.numberOfBalls = 40;
                
                this.init();
                this.animate();
                
                window.addEventListener('resize', () => this.resizeCanvas());
            }
            
            init() {
                this.resizeCanvas();
                this.createBalls();
            }
            
            resizeCanvas() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
            
            createBalls() {
                this.balls = [];
                for (let i = 0; i < this.numberOfBalls; i++) {
                    this.balls.push(new Ball(this.canvas));
                }
            }

            updateBalls() {
                // Удаляем шары, которые ушли за пределы экрана
                this.balls = this.balls.filter(ball => {
                    return ball.y - ball.radius < this.canvas.height + 100;
                });
                
                // Добавляем новые шары сверху, если их меньше нужного количества
                if (this.balls.length < this.numberOfBalls) {
                    const ballsToAdd = this.numberOfBalls - this.balls.length;
                    for (let i = 0; i < ballsToAdd; i++) {
                        this.createNewBall();
                    }
                }
            }

            createNewBall() {
                const ball = new Ball(this.canvas);
                // Начальная позиция сверху за пределами экрана
                ball.x = Math.random() * this.canvas.width;
                ball.y = -ball.radius - Math.random() * 100;
                this.balls.push(ball);
            }
            
            animate() {
                requestAnimationFrame(() => this.animate());
                
                // Очистка canvas с небольшим размытием для следов
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Обновление количества шаров
                this.updateBalls();
                
                // Обновление и отрисовка шаров
                this.balls.forEach(ball => {
                    ball.update();
                    ball.draw();
                });
            }
        }

        // Запуск анимации когда страница загрузится
        window.addEventListener('load', () => {
            new BallAnimation();
        })
