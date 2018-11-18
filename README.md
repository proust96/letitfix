# Let it fix - OpenBanking Hackathon 2018

Let it fix combines a innovative way for users to find their issues, a chatbot, powered by IBM Watson Assistant, to understand natural language, and finally a deep analysis of data - collected automatically and by feedback.
This allows the system to improve over time, in order to make the most out of the support team.

## Demo
There is a live demo running here ([website](http://letitfix.poleno.fr/) and [video](https://www.youtube.com/watch?v=0bI4mqZShd4)), showcasing our issues map, and some chatbot interactions.

[Here](https://github.com/proust96/chatbot_back) is a link to a back-end for our bot, which is a connector to IBM Cloud. We use the assistant to determine the user's intent, make small talk, understand basic commands (e.g. "go back one step").

## Technical stack

Node, jQuery, D3.js, IBM Watson Assistant.

## Roadmap

- [x] Issues map
- [x] Chatbot back-end / dialog workflow
- [x] Main app logic
- [ ] Link app to back-end
- [ ] Make better use of data (reorganize the layout of the issues map according to feedback, ...)
- [ ] App graphical identity & Integration as a plugin

## Screenshots

Issues map : ![Issues map](https://github.com/proust96/letitfix/blob/master/screenshots/Capture3.PNG?raw=true "Issues map")

Step by step problem solving : ![Step by Step problem solving](https://github.com/proust96/letitfix/blob/master/screenshots/Capture4.PNG?raw=true "Step by Step problem solving")
