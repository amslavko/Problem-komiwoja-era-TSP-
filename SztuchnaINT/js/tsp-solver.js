class TSPSolver {
    constructor(config) {
        this.config = config;
        this.population = [];
        this.bestRoute = null;
        this.bestDistance = Infinity;
        this.running = false;
        this.currentGeneration = 0;
    }

    solve(callback) {
        this.running = true;
        this.currentGeneration = 0;
        this.initializePopulation();

        const evolve = () => {
            if (!this.running || this.currentGeneration >= this.config.generations) {
                this.running = false;
                return;
            }

            this.currentGeneration++;
            this.evolveGeneration();

            if (callback) {
                callback(this.currentGeneration, this.bestRoute, this.bestDistance);
            }

            setTimeout(evolve, 0);
        };

        evolve();
    }

    stop() {
        this.running = false;
    }

    initializePopulation() {
        this.population = [];
        const numCities = this.config.cities.length;

        for (let i = 0; i < this.config.populationSize; i++) {
            const route = this.createRandomRoute(numCities);
            const distance = this.calculateDistance(route);
            this.population.push({ route, distance });

            if (distance < this.bestDistance) {
                this.bestDistance = distance;
                this.bestRoute = [...route];
            }
        }

        this.population.sort((a, b) => a.distance - b.distance);
    }

    createRandomRoute(numCities) {
        const route = Array.from({ length: numCities }, (_, i) => i);
        for (let i = route.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [route[i], route[j]] = [route[j], route[i]];
        }
        return route;
    }

    calculateDistance(route) {
        let total = 0;
        for (let i = 0; i < route.length - 1; i++) {
            total += this.getDistance(route[i], route[i + 1]);
        }
        total += this.getDistance(route[route.length - 1], route[0]);
        return total;
    }

    getDistance(cityIndex1, cityIndex2) {
        const city1 = this.config.cities[cityIndex1];
        const city2 = this.config.cities[cityIndex2];
        
        const dx = city1.x - city2.x;
        const dy = city1.y - city2.y;
        
        return Math.sqrt(dx * dx + dy * dy);
    }

    evolveGeneration() {
        const newPopulation = [];

        // Элитизм
        for (let i = 0; i < this.config.eliteSize && i < this.population.length; i++) {
            newPopulation.push({ 
                route: [...this.population[i].route],
                distance: this.population[i].distance
            });
        }

        while (newPopulation.length < this.config.populationSize) {
            const parent1 = this.tournamentSelection();
            const parent2 = this.tournamentSelection();

            let child = orderCrossover(parent1.route, parent2.route);

            if (Math.random() < this.config.mutationRate) {
                child = swapMutation(child);
            }

            const distance = this.calculateDistance(child);
            newPopulation.push({ route: child, distance });

            if (distance < this.bestDistance) {
                this.bestDistance = distance;
                this.bestRoute = [...child];
            }
        }

        this.population = newPopulation;
        this.population.sort((a, b) => a.distance - b.distance);
    }

    tournamentSelection() {
        const tournamentSize = 5;
        let best = null;

        for (let i = 0; i < tournamentSize; i++) {
            const candidate = this.population[Math.floor(Math.random() * this.population.length)];
            if (!best || candidate.distance < best.distance) {
                best = candidate;
            }
        }

        return best;
    }
}