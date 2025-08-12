const { VM } = require('vm2');

// @desc    Execute JavaScript code in a sandbox
// @route   POST /api/execute
const executeCode = (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'No code provided.' });
    }

    const output = [];
    
    // Create a new sandbox
    const vm = new VM({
        timeout: 5000, // 5 seconds timeout to prevent infinite loops
        sandbox: {
            // Intercept console.log inside the sandbox
            console: {
                log: (...args) => {
                    output.push(args.map(arg => JSON.stringify(arg)).join(' '));
                }
            }
        }
    });

    try {
        // Run the code within the secure VM
        vm.run(code);
        
        // Send the captured output back
        res.status(200).json({
            success: true,
            output: output.length > 0 ? output.join('\n') : "✅ Code executed with no output."
        });

    } catch (error) {
        // If the code throws an error, send it back
        res.status(200).json({
            success: false,
            output: `❌ Error: ${error.message}`
        });
    }
};

module.exports = { executeCode };