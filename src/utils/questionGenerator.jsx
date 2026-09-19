export const generateQuestion = (type, difficulty = 'medium') => {
  let question = {};
  let num1, num2, num3, num4;

  const ranges = {
    easy: { min: 1, max: 10 },
    medium: { min: 1, max: 50 },
    hard: { min: 1, max: 100 },
  };

  const range = ranges[difficulty];

  const getRandomNumber = (min = range.min, max = range.max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  switch (type) {
    case 'addition':
      num1 = getRandomNumber();
      num2 = getRandomNumber();
      question = {
        text: `${num1} + ${num2} = ?`,
        answer: num1 + num2,
        type: 'addition',
      };
      break;

    case 'subtraction':
      num1 = getRandomNumber();
      num2 = getRandomNumber();
      if (num2 > num1) [num1, num2] = [num2, num1];
      question = {
        text: `${num1} - ${num2} = ?`,
        answer: num1 - num2,
        type: 'subtraction',
      };
      break;

    case 'multiplication':
      num1 = getRandomNumber(1, difficulty === 'hard' ? 20 : 12);
      num2 = getRandomNumber(1, difficulty === 'hard' ? 20 : 12);
      question = {
        text: `${num1} × ${num2} = ?`,
        answer: num1 * num2,
        type: 'multiplication',
      };
      break;

    case 'division': {
      num2 = getRandomNumber(2, 12);
      const divAnswer = getRandomNumber(1, 12);
      num1 = num2 * divAnswer;
      question = {
        text: `${num1} ÷ ${num2} = ?`,
        answer: divAnswer,
        type: 'division',
      };
      break;
    }

    case 'bodmas': {
      const bodmasType = Math.floor(Math.random() * 4);
      switch (bodmasType) {
        case 0:
          num1 = getRandomNumber(1, 10);
          num2 = getRandomNumber(1, 10);
          num3 = getRandomNumber(1, 10);
          question = {
            text: `${num1} + ${num2} × ${num3} = ?`,
            answer: num1 + num2 * num3,
            type: 'bodmas',
          };
          break;
        case 1:
          num1 = getRandomNumber(1, 10);
          num2 = getRandomNumber(1, 10);
          num3 = getRandomNumber(1, 10);
          question = {
            text: `${num1} × ${num2} - ${num3} = ?`,
            answer: num1 * num2 - num3,
            type: 'bodmas',
          };
          break;
        case 2:
          num1 = getRandomNumber(1, 10);
          num2 = getRandomNumber(1, 10);
          num3 = getRandomNumber(1, 10);
          question = {
            text: `(${num1} + ${num2}) × ${num3} = ?`,
            answer: (num1 + num2) * num3,
            type: 'bodmas',
          };
          break;
        case 3:
          num1 = getRandomNumber(1, 10);
          num2 = getRandomNumber(1, 10);
          num3 = getRandomNumber(1, 10);
          num4 = getRandomNumber(1, 10);
          question = {
            text: `${num1} + ${num2} × ${num3} - ${num4} = ?`,
            answer: num1 + num2 * num3 - num4,
            type: 'bodmas',
          };
          break;
      }
      break;
    }
  }

  const options = generateOptions(question.answer);
  return { ...question, options, correctOption: question.answer };
};

const generateOptions = (correctAnswer) => {
  const options = [correctAnswer];
  const variations = [-10, -5, -2, -1, 1, 2, 5, 10];
  let safety = 0;

  while (options.length < 4 && safety < 50) {
    safety++;
    const variation = variations[Math.floor(Math.random() * variations.length)];
    const wrongAnswer = correctAnswer + variation;
    if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
    if (options.length < 4 && Math.random() > 0.7) {
      const randomAnswer = Math.floor(Math.random() * 100) + 1;
      if (!options.includes(randomAnswer)) options.push(randomAnswer);
    }
  }

  while (options.length < 4) {
    const fallback = Math.floor(Math.random() * 200) + 1;
    if (!options.includes(fallback)) options.push(fallback);
  }

  return options.sort(() => Math.random() - 0.5);
};

export const generateQuiz = (type, numberOfQuestions = 10, difficulty = 'medium') => {
  const questions = [];
  for (let i = 0; i < numberOfQuestions; i++) {
    questions.push(generateQuestion(type, difficulty));
  }
  return questions;
};