module.exports = {
  '*.+(js|jsx|tsx|ts)': [
    'jest --findRelatedTests --passWithNoTests --detectOpenHandles --forceExit',
    () => "npm run lint",
  ],
};
