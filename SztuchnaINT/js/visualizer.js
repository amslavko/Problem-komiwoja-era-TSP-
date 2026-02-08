class Visualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.padding = 40;
        this.cities = [];
        this.route = [];
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.draw();
    }

    setCities(cities) {
        this.cities = cities;
        this.normalizeCoordinates();
    }

    normalizeCoordinates() {
        if (this.cities.length === 0) return;

        const xs = this.cities.map(c => c.x);
        const ys = this.cities.map(c => c.y);
        
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const width = this.canvas.width - 2 * this.padding;
        const height = this.canvas.height - 2 * this.padding;

        this.normalizedCities = this.cities.map(city => ({
            id: city.id,
            x: this.padding + ((city.x - minX) / (maxX - minX)) * width,
            y: this.padding + ((city.y - minY) / (maxY - minY)) * height,
            originalX: city.x,
            originalY: city.y
        }));
    }

    setRoute(route) {
        this.route = route;
        this.draw();
    }

    draw() {
        if (!this.normalizedCities || this.normalizedCities.length === 0) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Рисуем маршрут
        if (this.route.length > 0) {
            this.ctx.strokeStyle = '#667eea';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();

            for (let i = 0; i < this.route.length; i++) {
                const city = this.normalizedCities[this.route[i]];
                if (i === 0) {
                    this.ctx.moveTo(city.x, city.y);
                } else {
                    this.ctx.lineTo(city.x, city.y);
                }
            }

            const firstCity = this.normalizedCities[this.route[0]];
            this.ctx.lineTo(firstCity.x, firstCity.y);
            this.ctx.stroke();
        }

        this.normalizedCities.forEach((city, index) => {
            const isStart = this.route.length > 0 && this.route[0] === index;
            
            this.ctx.fillStyle = isStart ? '#e74c3c' : '#2ecc71';
            this.ctx.beginPath();
            this.ctx.arc(city.x, city.y, isStart ? 6 : 4, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#333';
            this.ctx.font = this.normalizedCities.length <= 52 ? '10px Arial' : '6px Arial';
            this.ctx.fillText(city.id, city.x + 8, city.y - 8);
        });
    }
}