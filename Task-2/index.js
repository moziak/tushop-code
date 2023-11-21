const fs = require('fs');

function findGoodiesDistribution(goodies, employees) {
    // Sort the goodies based on their prices
    goodies.sort((a, b) => a.price - b.price);

    let minDifference = Infinity;
    let selectedGoodies = [];

    // Find the distribution with the minimum difference
    for (let i = 0; i <= goodies.length - employees; i++) {
        const currentDifference = goodies[i + employees - 1].price - goodies[i].price;

        if (currentDifference < minDifference) {
            minDifference = currentDifference;
            selectedGoodies = goodies.slice(i, i + employees);
        }
    }

    return { selectedGoodies, minDifference };
}

function readInputFromFile(filename) {
    const data = fs.readFileSync(filename, 'utf8').split('\n');
    const employees = parseInt(data[0].split(': ')[1], 10);

    const goodies = data.slice(2).map(line => {
        const [name, price] = line.split(': ');
        return { name, price: parseInt(price, 10) };
    });

    return { employees, goodies };
}

function writeOutputToFile(filename, result) {
    const output = `The goodies selected for distribution are:\n${result.selectedGoodies.map(g => `${g.name}: ${g.price}`).join('\n')}\nAnd the difference between the chosen goodie with the highest price and the lowest price is ${result.minDifference}.`;

    fs.writeFileSync(filename, output);
}

function main() {
    const inputFilename = "sample_input.txt";
    const outputFilename = 'sample_output.txt';

    const { employees, goodies } = readInputFromFile(inputFilename);
    const result = findGoodiesDistribution(goodies, employees);
    writeOutputToFile(outputFilename, result);
}

main();
