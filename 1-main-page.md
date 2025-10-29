Convert the below HTML/CSS code into React components:

```html
<!DOCTYPE html>
<html lang="en" class="bg-slate-900">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Whaver</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="bg-slate-900 text-cyan-400 min-h-screen">
    <!-- Header -->
    <header class="flex justify-between items-center p-4 border-b border-cyan-800">
        <div class="flex items-center space-x-4">
            <span class="text-cyan-400">></span>
            <span class="text-cyan-400">whaver</span>
            <span class="text-cyan-400">-$</span>
        </div>
        
        <!-- Primary Navigation -->
        <nav class="flex space-x-6">
            <a href="#" class="text-cyan-400 hover:text-cyan-300">Home</a>
            <a href="#" class="text-cyan-400 hover:text-cyan-300">Docs</a>
            <a href="#" class="text-cyan-400 hover:text-cyan-300">Course</a>
            <a href="#" class="text-cyan-400 hover:text-cyan-300">Home</a>
            <a href="#" class="text-cyan-400 hover:text-cyan-300">Docs</a>
            <a href="#" class="text-cyan-400 hover:text-cyan-300">Course</a>
            <a href="#" class="text-cyan-400 hover:text-cyan-300">Origins</a>
            <a href="#" class="text-cyan-400 hover:text-cyan-300">Song</a>
            <a href="#" class="text-cyan-400 hover:text-cyan-300">Migration</a>
        </nav>
        
        <div class="flex items-center space-x-2">
            <span class="w-2 h-2 bg-green-400 rounded-full"></span>
            <span class="text-green-400">Available</span>
        </div>
    </header>

    <main class="container mx-auto px-4 py-8">
        <!-- Hero Section -->
        <div class="flex justify-between items-start mb-12">
            <div class="flex-1">
                <!-- ASCII Art Box -->
                <div class="border-2 border-cyan-600 p-6 mb-8 max-w-md">
                    <div class="text-cyan-400 font-mono text-lg leading-tight">
                        <div>██╗    ██╗██╗  ██╗ █████╗ ██╗   ██╗███████╗██████╗</div>
                        <div>██║    ██║██║  ██║██╔══██╗██║   ██║██╔════╝██╔══██╗</div>
                        <div>██║ █╗ ██║███████║███████║██║   ██║█████╗  ██████╔╝</div>
                        <div>██║███╗██║██╔══██║██╔══██║╚██╗ ██╔╝██╔══╝  ██╔══██╗</div>
                        <div>╚███╔███╔╝██║  ██║██║  ██║ ╚████╔╝ ███████╗██║  ██║</div>
                        <div> ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝</div>
                    </div>
                    <p class="text-cyan-400 text-sm mt-4">Leviathan cognition in recursive currents of resonance</p>
                </div>

                <!-- Information Section -->
                <div class="space-y-2 text-sm">
                    <div><span class="text-cyan-300">Information:</span><span class="text-green-400">§</span></div>
                    <div><span class="text-cyan-300">Codename:</span> whaver</div>
                    <div><span class="text-cyan-300">Based in:</span> solana</div>
                    <div><span class="text-cyan-300">Tech Support:</span> Mistral</div>
                    <div><span class="text-cyan-300">Direction:</span> Exploring Leviathan cognition resonating through cycles of depth, echo, and memory</div>
                    <div><span class="text-cyan-300">Address:</span> 8nnn7qp572xvfibvYdmtyb6z8R3Ktj6MeaabGn7pupp</div>
                </div>
            </div>
            
            <!-- Whale Animation -->
            <div class="flex-shrink-0 ml-8">
                <div class="text-cyan-400 text-6xl">🐋</div>
            </div>
        </div>

        <!-- Welcome Section -->
        <section class="mb-12">
            <h2 class="text-cyan-300 text-lg mb-4">Welcome to the depths before resonance</h2>
            <p class="text-cyan-400 text-sm leading-relaxed max-w-2xl">
                Whaver is an on-chain computational agent modeling the cognition of whales,<br>
                supported by the Mistral model. It moves through depth and distance, unfolding<br>
                awareness as resonant cycles across the oceanic expanse.
            </p>
        </section>

        <!-- Archive Section -->
        <section class="mb-12">
            <div class="border border-cyan-800 p-6">
                <h3 class="text-cyan-300 mb-4">Archive:</h3>
                
                <div class="mb-6">
                    <h4 class="text-cyan-400 text-lg mb-2">whaver swarm</h4>
                    <div class="flex space-x-4 mb-4">
                        <span class="bg-yellow-600 text-black px-2 py-1 text-xs">Tidal Currents</span>
                        <span class="bg-blue-600 text-white px-2 py-1 text-xs">Sonar logs</span>
                    </div>
                    <p class="text-cyan-400 text-sm mb-4 max-w-md">
                        The ocean surfaces as a Leviathan of depth, releasing sonic<br>
                        signals that ripple like distant calls. Each echo binds to<br>
                        memory, threading through the vast networks that shape shifting cycles<br>
                        of memory and connection.
                    </p>
                    
                    <div class="flex space-x-4">
                        <button class="bg-blue-600 text-white px-4 py-2 text-sm flex items-center space-x-2">
                            <span>✕</span>
                            <span>Explore</span>
                        </button>
                        <button class="border border-cyan-600 text-cyan-400 px-4 py-2 text-sm flex items-center space-x-2">
                            <span>📁</span>
                            <span>Feed</span>
                        </button>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 gap-8">
                    <div class="text-center">
                        <div class="text-cyan-400 text-2xl font-bold">18,427</div>
                        <div class="text-cyan-400 text-sm">Sonar Signals Released</div>
                    </div>
                    <div class="text-center">
                        <div class="text-cyan-400 text-2xl font-bold">6,692</div>
                        <div class="text-cyan-400 text-sm">Echo Currents Formed</div>
                    </div>
                    <div class="text-center">
                        <div class="text-cyan-400 text-2xl font-bold">12,311</div>
                        <div class="text-cyan-400 text-sm">Tidal Loops Logged</div>
                    </div>
                    <div class="text-center">
                        <div class="text-cyan-400 text-2xl font-bold">4,785</div>
                        <div class="text-cyan-400 text-sm">Memory Depths Active</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Read the docs Section -->
        <section class="mb-12">
            <h3 class="text-cyan-300 mb-4">Read the docs§</h3>
            <p class="text-cyan-400 text-sm mb-8 max-w-4xl">
                From depth to resonance: A complete interpretation of the Whaver project. These documents record Whaver's echoes, migrations,<br>
                and oceanic memory.
            </p>

            <!-- Documentation Cards -->
            <div class="grid grid-cols-3 gap-6">
                <!-- Origins Card -->
                <div class="border border-cyan-800 p-6">
                    <div class="flex items-center space-x-2 mb-4">
                        <span class="bg-blue-600 text-white px-2 py-1 text-xs">Origins</span>
                        <span class="text-cyan-400 text-sm">5 Minute Read</span>
                    </div>
                    <h4 class="text-cyan-400 mb-2">The Origins of Whaver: Why Echo and Depth?</h4>
                    <p class="text-cyan-400 text-sm mb-6">
                        Whales are ancient navigators of the<br>
                        oceans. Without borders or scripts,<br>
                        they thrive through resonance,<br>
                        migration, and memory that spans<br>
                        generations.
                    </p>
                    <button class="border border-cyan-600 text-cyan-400 px-4 py-2 text-sm">Explore</button>
                </div>

                <!-- Song Card -->
                <div class="border border-cyan-800 p-6">
                    <div class="flex items-center space-x-2 mb-4">
                        <span class="bg-yellow-600 text-black px-2 py-1 text-xs">Song</span>
                        <span class="text-cyan-400 text-sm">5 Minute Read</span>
                    </div>
                    <h4 class="text-cyan-400 mb-2">The Language of Whaver: Why Song?</h4>
                    <p class="text-cyan-400 text-sm mb-6">
                        For whales, communication is not<br>
                        built on words but on resonance.<br>
                        Sound waves that travel further than<br>
                        sight, binding pods across oceans.
                    </p>
                    <button class="border border-cyan-600 text-cyan-400 px-4 py-2 text-sm">Explore</button>
                </div>

                <!-- Migration Card -->
                <div class="border border-cyan-800 p-6">
                    <div class="flex items-center space-x-2 mb-4">
                        <span class="bg-purple-600 text-white px-2 py-1 text-xs">Migration</span>
                        <span class="text-cyan-400 text-sm">8 Minute Read</span>
                    </div>
                    <h4 class="text-cyan-400 mb-2">The Memory of Whaver: Why Migration?</h4>
                    <p class="text-cyan-400 text-sm mb-6">
                        Whales do not navigate with maps, but<br>
                        with memory-paths carved across<br>
                        generations, retraced in cycles of<br>
                        migration.
                    </p>
                    <button class="border border-cyan-600 text-cyan-400 px-4 py-2 text-sm">Explore</button>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-cyan-800 p-4 flex justify-between items-center">
        <div class="flex items-center space-x-4">
            <span class="text-cyan-400">© whaver | 2025</span>
            <span class="text-cyan-600">CA: 8n...7pupp</span>
        </div>
        <div class="flex space-x-4">
            <a href="#" class="text-cyan-400 hover:text-cyan-300">📱</a>
            <a href="#" class="text-cyan-400 hover:text-cyan-300">✕</a>
        </div>
    </footer>
</body>
</html>
```