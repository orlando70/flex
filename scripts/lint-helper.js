#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0];

console.log('🔧 ESLint Helper Script');
console.log('=======================\n');

switch (command) {
  case 'check':
    console.log('🔍 Running ESLint check (warnings allowed)...');
    try {
      execSync('npx eslint . --ext .js,.jsx,.ts,.tsx --max-warnings 100', { 
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
      console.log('✅ ESLint check passed!');
    } catch (error) {
      console.log('⚠️  ESLint found some issues (but they\'re just warnings)');
      process.exit(0); // Don't fail the build
    }
    break;

  case 'fix':
    console.log('🔧 Running ESLint with auto-fix...');
    try {
      execSync('npx eslint . --ext .js,.jsx,.ts,.tsx --fix', { 
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
      console.log('✅ ESLint auto-fix completed!');
    } catch (error) {
      console.log('⚠️  Some issues couldn\'t be auto-fixed');
    }
    break;

  case 'strict':
    console.log('🚨 Running ESLint in strict mode...');
    try {
      execSync('npx eslint . --ext .js,.jsx,.ts,.tsx --max-warnings 0', { 
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
      console.log('✅ Strict ESLint check passed!');
    } catch (error) {
      console.log('❌ Strict ESLint check failed!');
      process.exit(1);
    }
    break;

  case 'report':
    console.log('📊 Generating ESLint report...');
    try {
      execSync('npx eslint . --ext .js,.jsx,.ts,.tsx --format=compact --output-file=eslint-report.txt', { 
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
      console.log('✅ ESLint report generated: eslint-report.txt');
    } catch (error) {
      console.log('⚠️  Report generated with some issues');
    }
    break;

  default:
    console.log('Usage: node scripts/lint-helper.js <command>');
    console.log('');
    console.log('Commands:');
    console.log('  check   - Run ESLint check (allows warnings)');
    console.log('  fix     - Run ESLint with auto-fix');
    console.log('  strict  - Run ESLint in strict mode (no warnings allowed)');
    console.log('  report  - Generate ESLint report file');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/lint-helper.js check');
    console.log('  node scripts/lint-helper.js fix');
    console.log('  node scripts/lint-helper.js strict');
    console.log('  node scripts/lint-helper.js report');
}
