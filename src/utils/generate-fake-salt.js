import randomseed from 'random-seed';

function generateFakeSalt(seed) {
  const salt = randomseed

    // Seed the psuedo-random number generator with a seed so the output is deterministic
    .create(seed)

    // Instead of a number, generate a string of sufficient length,
    // so that even when invalid characters are stripped out,
    // there will be enough characters to compose the salt
    .string(110)

    // Replace all characters outside the character range of a valid bcrypt salt
    .replace(/[^a-zA-Z0-9./]/g, '')

    // Extract only the first 22 characters for the salt
    .slice(0, 22);

  // Prepend the bcrypt algorithm version and cost parameters
  return `$2a$10$${salt}`;
}

export default generateFakeSalt;
