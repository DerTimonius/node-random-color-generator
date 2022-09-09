import chalk from 'chalk';
import promptSync from 'prompt-sync';
import randomColor from 'randomcolor';

const prompt = promptSync();
const args = process.argv.slice(2);
let color;
let width = 31;
let height = 9;
let output = '';

const supportedColors = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'monochrome',
];
const supportedLuminosity = ['bright', 'light', 'dark'];

function correctDimensions(inputWidth, inputHeight) {
  return inputWidth >= 21 && inputHeight >= 7 ? true : false;
}

/* changes the color depending on the user input
   if none is given the color is completely random*/
if (args.length > 0) {
  if (args[0] === 'ask') {
    const colorHue = prompt(
      'what color would you like? e.g. blue, red, green etc.\t',
    );
    const colorLuminosity = prompt(
      'And what luminosity would you like? e.g. light, dark\t',
    );
    color = randomColor({
      hue: colorHue,
      luminosity: colorLuminosity,
    });
  } else if (args.length === 1) {
    // checks whether the input is a color or a luminosity value
    if (supportedColors.includes(args[0])) {
      color = randomColor({ hue: args[0] });
    } else if (supportedLuminosity.includes(args[0])) {
      color = randomColor({ luminosity: args[0] });
    }
  } else if (args.length === 2) {
    // checks if the first input is a color or a luminosity value
    if (supportedColors.includes(args[0])) {
      color = randomColor({
        hue: args[0],
        luminosity: args[1],
      });
    } else {
      color = randomColor({
        hue: args[1],
        luminosity: args[0],
      });
    }
  } else if (args.length === 3) {
    const dimensions = args[0].split('X');
    // checks if the input dimensions meet a certain threshold
    if (correctDimensions(dimensions[0], dimensions[1])) {
      width = dimensions[0];
      height = dimensions[1];
      color = randomColor({
        hue: args[1],
        luminosity: args[2],
      });
    } else {
      throw new Error('Wrong dimensions, must be at least 21X7');
    }
  }
} else {
  color = randomColor();
}

// changes the output depending on the user input
for (let i = 1; i <= height; i++) {
  if (i === height) {
    output += '#'.repeat(width);
  } else if (i < Math.ceil(height / 2) - 1 || i > Math.ceil(height / 2) + 1) {
    output += '#'.repeat(width) + '\n';
  } else {
    if (i === Math.ceil(height / 2) - 1 || i === Math.ceil(height / 2) + 1) {
      output += '#'.repeat(5) + ' '.repeat(width - 10) + '#'.repeat(5) + '\n';
    } else {
      output +=
        '#'.repeat(5) +
        ' '.repeat((width - 16) / 2) +
        color +
        ' '.repeat((width - 16) / 2) +
        '#'.repeat(5) +
        '\n';
    }
  }
}

console.log(chalk.hex(color).visible(output));
