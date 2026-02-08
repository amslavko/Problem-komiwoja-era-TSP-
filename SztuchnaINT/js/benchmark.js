class Benchmark {
    constructor() {
        this.startTime = 0;
        this.endTime = 0;
        this.initialDistance = 0;
    }

    run(cities, finalDistance) {
        const randomRoute = Array.from({ length: cities.length }, (_, i) => i);
        for (let i = randomRoute.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [randomRoute[i], randomRoute[j]] = [randomRoute[j], randomRoute[i]];
        }

        this.initialDistance = this.calculateRouteDistance(cities, randomRoute);

        const executionTime = parseFloat(document.getElementById('executionTime').textContent) || 0;
        const generations = parseInt(document.getElementById('currentGen').textContent) || 1;

        const generationsPerSecond = (generations / executionTime) * 1000;
        const avgIterationTime = executionTime / generations;
        const improvement = ((this.initialDistance - finalDistance) / this.initialDistance) * 100;

        return {
            executionTime,
            generationsPerSecond,
            avgIterationTime,
            finalDistance,
            initialDistance: this.initialDistance,
            improvement,
            convergenceRate: this.classifyConvergence(improvement),
            stagnationGenerations: Math.floor(generations * 0.3)
        };
    }
    calculateRouteDistance(cities, route) {
        let total = 0;
        for (let i = 0; i < route.length - 1; i++) {
            total += this.getDistance(cities[route[i]], cities[route[i + 1]]);
        }
        total += this.getDistance(cities[route[route.length - 1]], cities[route[0]]);
        return total;
    }

    getDistance(city1, city2) {
        const dx = city1.x - city2.x;
        const dy = city1.y - city2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    classifyConvergence(improvement) {
        if (improvement > 50) return 'Very Good';
        if (improvement > 30) return 'Good';
        if (improvement > 15) return 'Decent';
        return 'Slow';
    }
}