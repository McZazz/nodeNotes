# nodeNotes

A simple node based note making app using Flask. This is a personal project which needs quite a bit of work, however, as-is it is pretty useful for text based brainstorming in a node based gui environment.

Installation and startup:
1) Install Flask for python via entering the following in your command line if running your OS's install of Python: pip install Flask

2) Navigate to inside the nodeNotes folder and in the command line enter: python app.py

3) Python will display your local address with a port at the bottom, it is probably going to be: http://127.0.0.1:5000/

4) Copy-paste the address into a browser and the app will run.

Usage: 
click either the "Create Node" or "Create Folder" buttons to create and place a new node or folder.

Side and top strips of nodes and folders: 
The dark gray button is the button to access settings, and enter text. The medium gray strip in the center allows for moving nodes and folders around. The light gray squares on the ends are input and output buttons. Left and top light gray squares are inputs, and the right and bottom light gray squares are outputs.

Connecting wires: 
Clicking an output first, then an input creates a wire. As many connections as you want can be made.

Deleting wires: 
Hover over a wire and double click.

Folder navigation: 
Click on the summary area of a folder, it will take you inside, or, to another folder if you specified that in it's settings.

Other tidbits: 
• Clicking the delete button in the settings of any node, or any folder that does not have other folders in it will mercelessly delete everything inside, and the node without warning.
• If you have a folder inside, it will do nothing. It saves everything in a gaggle of JSON files automatically everytime you do anything in the app. 
• Folders can contain any number of nodes or folders you want, or reference other folders. 
• While in a folder, there is a button in the top-left of the screen which allows for going to the parent folder. 
• Any time you want to create a new project, just make a new copy of the nodeNotes folder, name it as you wish, and delete all the JSON files in your new copy. From there, your new project is ready to go, it will init clean new JSON files upon making hte first node or folder if it detects none present.

![image](https://user-images.githubusercontent.com/91503026/135016531-62a3995d-eda7-4650-b235-9e42feaec975.png)

![image](https://user-images.githubusercontent.com/91503026/135016548-15a855d0-6e6a-4c83-b66b-c2436fa37a15.png)

![image](https://user-images.githubusercontent.com/91503026/135016564-19c1261e-2394-43db-b0a8-8ae73c2ffbdf.png)


