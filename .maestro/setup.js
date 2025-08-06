// Set global flag to indicate Maestro is running
// Check if global exists and create it if not
if (typeof global === 'undefined') {
  var global = this;
}
global.__MAESTRO__ = true;

output.screens = {
  listWitchFetch: {
    firstItemId: '1-user-container',
    fifteenthItemId: '15-user-container',
    mockedFirstItemName: 'Umair Shaik',
  },
};

// You can add more setup here if needed
console.log('🎭 Maestro environment setup complete');
