import { spawn } from 'child_process';
import { join } from 'path';

describe('Server Startup', () => {
  it('should start without crashing due to apicache header access', async () => {
    const serverPath = join(__dirname, '..', 'dist', 'server.js');
    
    return new Promise<void>((resolve, reject) => {
      const child = spawn('node', [serverPath], { stdio: 'pipe' });
      
      let output = '';
      let errorOutput = '';
      
      child.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      // Give the server some time to start
      const timeout = setTimeout(() => {
        child.kill();
        
        // Check if the server started successfully
        if (output.includes('Listening on port 3000')) {
          resolve();
        } else if (errorOutput.includes("Cannot read properties of undefined (reading 'x-apicache-bypass')")) {
          reject(new Error('Server crashed with apicache header access error'));
        } else {
          reject(new Error(`Server failed to start. Output: ${output}, Error: ${errorOutput}`));
        }
      }, 3000);
      
      child.on('exit', (code) => {
        clearTimeout(timeout);
        
        if (code === 0 && output.includes('Listening on port 3000')) {
          resolve();
        } else if (errorOutput.includes("Cannot read properties of undefined (reading 'x-apicache-bypass')")) {
          reject(new Error('Server crashed with apicache header access error'));
        } else {
          reject(new Error(`Server exited with code ${code}. Output: ${output}, Error: ${errorOutput}`));
        }
      });
      
      child.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  });
});