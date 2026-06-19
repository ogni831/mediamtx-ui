#!/usr/bin/env node
import argon2 from 'argon2';
import process from 'process';

process.stdout.write('Enter the value to hash: ');

let input = '';
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', async (char) => {
    if (char === '\r' || char === '\n') { // Enter
        process.stdout.write('\n');
        process.stdin.setRawMode(false);
        process.stdin.pause();

        try {
            const hash = await argon2.hash(input);
            console.log('\nArgon2 hash:\n\n', hash, '\n');
        } catch (err) {
            console.error('Hashing error:', err);
            process.exit(1);
        }

    } else if (char === '\u0003') { // Ctrl+C
        process.exit();
    } else if (char === '\u0008' || char === '\u007f') { // Backspace
        if (input.length > 0) {
            input = input.slice(0, -1);
            process.stdout.write('\b \b');
        }
    } else {
        input += char;
        process.stdout.write('*');
    }
});
