document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const gameContainer = document.getElementById('game-container');
    const scoreElement = document.getElementById('score');
    let currentTrack = 1; // 0-3
    let score = 0;
    let gameActive = true;
    const trackPositions = ['12.5%', '37.5%', '62.5%', '87.5%'].map(pos => {
        const value = parseFloat(pos);
        return value + '%';
    });
    const obstacles = [];
    const obstaclePool = [];
    // 在文件开头添加速度相关变量
    let baseSpeed = 5;
    let currentSpeed = baseSpeed;
    const speedIncreaseFactor = 0.5; // 每100分增加的速度

    document.addEventListener('keydown', (e) => {
        if (!gameActive) return;

        const oldTrack = currentTrack;
        switch(e.key) {
            case 'ArrowLeft':
                currentTrack = Math.max(0, currentTrack - 1);
                break;
            case 'ArrowRight':
                currentTrack = Math.min(3, currentTrack + 1);
                break;
        }

        // 添加调试输出
        console.log('Track changed:', oldTrack, '->', currentTrack);
        player.style.left = trackPositions[currentTrack];
    });

    function createObstacle() {
        if (!gameActive) return;

        let obstacle;
        if (obstaclePool.length > 0) {
            obstacle = obstaclePool.pop();
        } else {
            obstacle = document.createElement('div');
            obstacle.className = 'obstacle';
        }

        const track = Math.floor(Math.random() * 4);
        obstacle.style.left = trackPositions[track];
        obstacle.style.top = '-50px';
        gameContainer.appendChild(obstacle);
        obstacles.push({ element: obstacle, track, position: -50 });
    }

    // 修改 updateObstacles 函数
    function updateObstacles() {
        const containerHeight = gameContainer.clientHeight;
        const playerHeight = 180;
        const obstacleHeight = 200;

        // 根据分数更新速度
        currentSpeed = baseSpeed + (Math.floor(score / 100) * speedIncreaseFactor);

        // 更新障碍物位置
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obstacle = obstacles[i];
            obstacle.position += currentSpeed; // 使用当前速度
            obstacle.element.style.top = obstacle.position + 'px';

            const playerBottom = containerHeight - 180;
            const playerTop = playerBottom - playerHeight;
            const obstacleBottom = obstacle.position + obstacleHeight;

            if (obstacle.position >= playerTop &&
                obstacle.position <= playerBottom &&
                currentTrack === obstacle.track) {
                gameOver();
            }

            if (obstacle.position > containerHeight) {
                gameContainer.removeChild(obstacle.element);
                obstaclePool.push(obstacle.element);
                obstacles.splice(i, 1);
                score += 10;
                scoreElement.textContent = score;

                // 在控制台输出当前速度（可选）
                console.log('Current speed:', currentSpeed);
            }
        }
    }

    function gameLoop() {
        if (!gameActive) return;
        updateObstacles();
        requestAnimationFrame(gameLoop);
    }

    function gameOver() {
        gameActive = false;
        alert(`游戏结束！得分：${score}`);
        location.reload();
    }

    setInterval(createObstacle, 500);
    requestAnimationFrame(gameLoop);
});
// testing 