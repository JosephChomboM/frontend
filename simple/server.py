import os
import sys
import webbrowser
from threading import Timer
import http.server
import socketserver

# Get the directory where the executable/script is located
if getattr(sys, 'frozen', False):
    # We're running in a bundle (PyInstaller executable)
    application_path = os.path.dirname(sys.executable)
else:
    # We're running in a normal Python environment
    application_path = os.path.dirname(os.path.abspath(__file__))

# Change to the directory where our HTML files are
os.chdir(application_path)

# Define port
PORT = 8080

# Create handler
handler = http.server.SimpleHTTPRequestHandler

# Open browser function
def open_browser():
    webbrowser.open_new(f'http://localhost:{PORT}/')

# Start the server in the main function
def main():
    print("WF Scoring VI Configurator starting...")
    print(f"Server running at: http://localhost:{PORT}/")
    
    # Open browser after a short delay
    Timer(1.5, open_browser).start()
    
    # Create the server
    with socketserver.TCPServer(("localhost", PORT), handler) as httpd:
        print("Press Ctrl+C to stop the server")
        try:
            # Start the server
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")
            httpd.shutdown()

if __name__ == "__main__":
    main()
