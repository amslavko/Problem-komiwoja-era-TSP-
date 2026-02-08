let tspSolver = null;
let visualizer = null;
let progressChart = null;
let isRunning = false;
let progressData = [];
let improvements = 0;
let lastBestDistance = Infinity;

document.addEventListener('DOMContentLoaded', () => {
    visualizer = new Visualizer('canvas');
    progressChart = new ProgressChart('progressChart');
    
    loadDataset('berlin52');
    
    document.getElementById('dataset').addEventListener('change', (e) => {
        loadDataset(e.target.value);
    });
    
    document.getElementById('startBtn').addEventListener('click', startSolver);
    document.getElementById('stopBtn').addEventListener('click', stopSolver);
});

async function loadDataset(name) {
    try {
        const response = await fetch(`data/${name}.tsp`);
        const text = await response.text();
        const cities = parseTSPFile(text);
        
        visualizer.setCities(cities);
        console.log(`Downloaded ${cities.length} cities from ${name}`);
    } catch (error) {
        console.error('error downloading data:', error);
        alert('Failed to load data file. Verify that the .tsp files are in the data folder./');
    }
}

function parseTSPFile(text) {
    const lines = text.split('\n');
    const cities = [];
    let nodeSection = false;

    for (let line of lines) {
        line = line.trim();
        
        if (line === 'NODE_COORD_SECTION') {
            nodeSection = true;
            continue;
        }
        
        if (line === 'EOF' || line === '') continue;
        
        if (nodeSection) {
            const parts = line.split(/\s+/);
            if (parts.length >= 3) {
                cities.push({
                    id: parseInt(parts[0]),
                    x: parseFloat(parts[1]),
                    y: parseFloat(parts[2])
                });
            }
        }
    }

    return cities;
}

function startSolver() {
    if (isRunning) return;
    
    if (!visualizer.cities || visualizer.cities.length === 0) {
        alert('Download the dataset first!');
        return;
    }

    // clear last results
    progressData = [];
    improvements = 0;
    lastBestDistance = Infinity;
    
    document.getElementById('currentGen').textContent = '0';
    document.getElementById('bestDistance').textContent = '-';
    document.getElementById('executionTime').textContent = '0 мс';
    document.getElementById('improvements').textContent = '0';
    document.getElementById('benchmarkResults').innerHTML = '';
    
    // clear the visualizer
    visualizer.setRoute([]);
    progressChart.clear();
    
    const config = {
        cities: visualizer.cities,
        populationSize: parseInt(document.getElementById('populationSize').value),
        generations: parseInt(document.getElementById('generations').value),
        mutationRate: parseFloat(document.getElementById('mutationRate').value) / 100,
        eliteSize: parseInt(document.getElementById('eliteSize').value)
    };

    tspSolver = new TSPSolver(config);
    
    isRunning = true;
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;

    const startTime = Date.now();
    
    tspSolver.solve((generation, bestRoute, bestDistance) => {
        updateUI(generation, bestRoute, bestDistance, startTime);
    });
}

function stopSolver() {
    if (tspSolver) {
        tspSolver.stop();
    }
    isRunning = false;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    
    const finalDistance = parseFloat(document.getElementById('bestDistance').textContent) || 0;
    if (finalDistance > 0) {
        runBenchmark(finalDistance);
    }
}

function updateUI(generation, bestRoute, bestDistance, startTime) {
    document.getElementById('currentGen').textContent = generation;
    document.getElementById('bestDistance').textContent = bestDistance.toFixed(2);
    document.getElementById('executionTime').textContent = `${Date.now() - startTime} мс`;
    
    if (bestDistance < lastBestDistance) {
        improvements++;
        lastBestDistance = bestDistance;
    }
    document.getElementById('improvements').textContent = improvements;

    visualizer.setRoute(bestRoute);
    
    progressData.push({ generation, distance: bestDistance });
    if (generation % 5 === 0) {
        progressChart.update(progressData);
    }

    if (generation >= tspSolver.config.generations) {
        stopSolver();
    }
}

function runBenchmark(finalDistance) {
    const benchmark = new Benchmark();
    const results = benchmark.run(visualizer.cities, finalDistance);
    displayBenchmarkResults(results);
}

function displayBenchmarkResults(results) {
    const container = document.getElementById('benchmarkResults');
    container.innerHTML = `
        <div class="benchmark-item">
            <h4>⏱️ Performance</h4>
            <p><strong>Time spent:</strong> ${results.executionTime.toFixed(2)} ms</p>
            <p><strong>Generations per second:</strong> ${results.generationsPerSecond.toFixed(2)}</p>
            <p><strong>Middle iteration:</strong> ${results.avgIterationTime.toFixed(4)} ms</p>
        </div>
        <div class="benchmark-item">
            <h4>🎯 Solution quality</h4>
            <p><strong>Final distance:</strong> ${results.finalDistance.toFixed(2)}</p>
            <p><strong>Initial distance:</strong> ${results.initialDistance.toFixed(2)}</p>
            <p><strong>Improvement:</strong> ${results.improvement.toFixed(2)}%</p>
        </div>
        <div class="benchmark-item">
            <h4>📈 Convergence</h4>
            <p><strong>Convergence speed:</strong> ${results.convergenceRate}</p>
            <p><strong>Stagnation:</strong> ${results.stagnationGenerations} generations</p>
        </div>
    `;
}

class ProgressChart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update(data) {
        if (data.length === 0) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const padding = 40;
        const width = this.canvas.width - 2 * padding;
        const height = this.canvas.height - 2 * padding;

        const maxGen = Math.max(...data.map(d => d.generation));
        const minDist = Math.min(...data.map(d => d.distance));
        const maxDist = Math.max(...data.map(d => d.distance));

        // Osi x i y
        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, this.canvas.height - padding);
        this.ctx.lineTo(this.canvas.width - padding, this.canvas.height - padding);
        this.ctx.stroke();

        // Grafik
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        data.forEach((point, index) => {
            const x = padding + (point.generation / maxGen) * width;
            const y = this.canvas.height - padding - ((point.distance - minDist) / (maxDist - minDist)) * height;

            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });

        this.ctx.stroke();

        this.ctx.fillStyle = '#333';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`New Gen: ${maxGen}`, this.canvas.width - padding - 100, this.canvas.height - 10);
        this.ctx.fillText(`Min: ${minDist.toFixed(0)}`, 10, padding);
    }
}