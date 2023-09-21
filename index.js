import { cancel, intro, isCancel, outro, select, text } from '@clack/prompts';
import chalk from 'chalk';
import randomColor from 'randomcolor';

function correctDimensions(inputWidth, inputHeight) {
  return inputWidth >= 21 && inputHeight >= 7 ? true : false;
}

function drawOutput(inputWidth, inputHeight, inputColor) {
  let output = '\n';
  for (let i = 1; i <= inputHeight; i++) {
    if (i === inputHeight) {
      output += '#'.repeat(inputWidth);
    } else if (
      i < Math.ceil(inputHeight / 2) - 1 ||
      i > Math.ceil(inputHeight / 2) + 1
    ) {
      output += '#'.repeat(inputWidth) + '\n';
    } else {
      if (
        i === Math.ceil(inputHeight / 2) - 1 ||
        i === Math.ceil(inputHeight / 2) + 1
      ) {
        output +=
          '#'.repeat(5) + ' '.repeat(inputWidth - 10) + '#'.repeat(5) + '\n';
      } else {
        output +=
          '#'.repeat(5) +
          ' '.repeat((inputWidth - 16) / 2) +
          inputColor +
          ' '.repeat((inputWidth - 16) / 2) +
          '#'.repeat(5) +
          '\n';
      }
    }
  }
  return output;
}

function quit() {
  cancel('Sad to see you leave!');
  process.exit(0);
}

const supportedColors = [
  { value: 'random', label: 'Random' },
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'monochrome', label: 'Monochrome' },
];

// get values using clack
intro('Welcome to the random color generator!');
const selectedHue = await select({
  message: 'Select a color hue',
  options: supportedColors,
});

if (isCancel(selectedHue)) {
  quit();
}

const selectedLuminosity = await select({
  message: 'Select a luminosity',
  options: [
    {
      value: 'random',
      label: 'Random',
    },
    {
      value: 'dark',
      label: 'Dark',
    },
    {
      value: 'bright',
      label: 'Bright',
    },
    {
      value: 'light',
      label: 'Light',
    },
  ],
});

if (isCancel(selectedLuminosity)) {
  quit();
}

const size = await text({
  message:
    'The default output is 31x9. You can resize it if you want (in the same format)',
  placeholder: '31x9',
  defaultValue: '31x9',
  validate(value) {
    if (value && value.split('x').some((num) => isNaN(parseInt(num)))) {
      return 'Only numbers allowed';
    }
    if (value && !correctDimensions(value.split('x')[0], value.split('x')[1])) {
      return 'Should be at least 21x7';
    }
  },
});

if (isCancel(size)) {
  quit();
}

const [width, height] = size.split('x');

const color = randomColor({ hue: selectedHue, luminosity: selectedLuminosity });

outro(chalk.hex(color).visible(drawOutput(width, height, color)));
