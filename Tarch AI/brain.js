// brain.js

// Initialize Brain.js Neural Network
const net = new brain.NeuralNetwork();

// Training data
net.train([
  { input: { science: 1, importance: 1 }, output: { "science and technology are integral to daily life": 1 } },
  { input: { example: 1, science: 1 }, output: { "examples include alarm clocks and electric lights": 1 } },
  { input: { save: 1, time: 1 }, output: { "science and technology save time and enhance comfort": 1 } },
  { input: { life: 1, without: 1 }, output: { "life is unimaginable without science and technology": 1 } },
  { input: { new: 1, technologies: 1 }, output: { "new technologies make life easier and more comfortable": 1 } },
  { input: { era: 1, technology: 1 }, output: { "we live in an era of science and technology": 1 } }
]);
