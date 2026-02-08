
function orderCrossover(parent1, parent2) {
    const size = parent1.length;
    const start = Math.floor(Math.random() * size);
    const end = Math.floor(Math.random() * (size - start)) + start;

    const child = new Array(size).fill(-1);

    for (let i = start; i <= end; i++) {
        child[i] = parent1[i];
    }

    let currentPos = (end + 1) % size;
    for (let i = 0; i < size; i++) {
        const gene = parent2[(end + 1 + i) % size];
        if (!child.includes(gene)) {
            child[currentPos] = gene;
            currentPos = (currentPos + 1) % size;
        }
    }

    return child;
}

function swapMutation(route) {
    const mutated = [...route];
    const i = Math.floor(Math.random() * mutated.length);
    const j = Math.floor(Math.random() * mutated.length);
    [mutated[i], mutated[j]] = [mutated[j], mutated[i]];
    return mutated;
}

function inversionMutation(route) {
    const mutated = [...route];
    const i = Math.floor(Math.random() * mutated.length);
    const j = Math.floor(Math.random() * mutated.length);
    const start = Math.min(i, j);
    const end = Math.max(i, j);
    
    const segment = mutated.slice(start, end + 1).reverse();
    mutated.splice(start, end - start + 1, ...segment);
    
    return mutated;
}