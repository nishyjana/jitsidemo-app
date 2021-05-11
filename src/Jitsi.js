import React, { Component } from "react";

export default class JitsiComponent extends Component {
	domain = "meet.expertrepublic.com";
	api = {};

	constructor(props) {
		super(props);
		this.state = {
			room: "Nishy Room",
			user: {
				name: "Nishy",
			},
			isAudioMuted: false,
			isVideoMuted: false,
		};
	}
	

	startMeet = () => {
		const options = {
			roomName: this.state.room,
			width: "100%",
			height: 900,
			configOverwrite: { prejoinPageEnabled: false },
			interfaceConfigOverwrite: { TILE_VIEW_MAX_COLUMNS: 5,DEFAULT_LOGO_URL:'' },
			parentNode: document.querySelector("#jitsi-iframe"),
			userInfo: {
				displayName: this.state.user.name,
			},
			

		};
		
		this.api = new window.JitsiMeetExternalAPI(this.domain, options);

		this.api.addEventListeners({
			readyToClose: this.handleClose,
			participantLeft: this.handleParticipantLeft,
			participantJoined: this.handleParticipantJoined,
			videoConferenceJoined: this.handleVideoConferenceJoined,
			videoConferenceLeft: this.handleVideoConferenceLeft,
			audioMuteStatusChanged: this.handleMuteStatus,
			videoMuteStatusChanged: this.handleVideoStatus,
			participantRoleChanged: this.handlePassword,
			passwordRequired: this.passwordRequired,
		});
	};

	handleClose = () => {
		//console.log("handleClose");
	};
	handlePassword = (event) => {
		if (event.role === "moderator") {
			this.api?.executeCommand("password", "EXPERT");
		}
	};
	passwordRequired = () => {
		this.api?.executeCommand("password", "EXPERT");
	};
	handleParticipantLeft = async (participant) => {
		//console.log("handleParticipantLeft", participant);
		const data = await this.getParticipants();
	};

	handleParticipantJoined = async (participant) => {
		//console.log("handleParticipantJoined", participant);
		const data = await this.getParticipants();
	};

	handleVideoConferenceJoined = async (participant) => {
		//	console.log("handleVideoConferenceJoined", participant);
		const data = await this.getParticipants();
	};

	handleVideoConferenceLeft = () => {
		//	console.log("handleVideoConferenceLeft");
		return "left";
	};

	handleMuteStatus = (audio) => {
		//	console.log("handleMuteStatus", audio); // { muted: true }
	};

	handleVideoStatus = (video) => {
		//	console.log("handleVideoStatus", video); // { muted: true }
	};

	executeCommand(command) {
		this.api.executeCommand(command);
		if (command === "hangup") {
			return this.props.history.push("/thank-you");
		}

		if (command === "toggleAudio") {
			this.setState({ isAudioMuted: !this.state.isAudioMuted });
		}

		if (command === "toggleVideo") {
			this.setState({ isVideoMuted: !this.state.isVideoMuted });
		}
	}

	getParticipants() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(this.api.getParticipantsInfo());
			}, 500);
		});
	}

	componentDidMount() {
		if (window.JitsiMeetExternalAPI) {
			this.startMeet();
			const data = this.api.getNumberOfParticipants();

			console.log(data, "no of participants");
		} else {
			alert("JitsiMeetExternalAPI not loaded");
		}
	}
	render() {
		const { isAudioMuted, isVideoMuted } = this.state;
		return (
			<>
				<header className='nav-bar'>
					<p className='item-left heading'>EXPERT REPUBLIC DEMO</p>
				</header>
				<div id='jitsi-iframe'></div>
				<div class='item-center'>
					<span>Custom Controls</span>
				</div>
				<div class='item-center'>
					<span>&nbsp;&nbsp;</span>
					<i
						onClick={() => this.executeCommand("toggleAudio")}
						className={`fas fa-2x grey-color ${
							isAudioMuted
								? "fa-microphone-slash"
								: "fa-microphone"
						}`}
						aria-hidden='true'
						title='Mute / Unmute'></i>
					<i
						onClick={() => this.executeCommand("hangup")}
						className='fas fa-phone-slash fa-2x red-color'
						aria-hidden='true'
						title='Leave'></i>
					<i
						onClick={() => this.executeCommand("toggleVideo")}
						className={`fas fa-2x grey-color ${
							isVideoMuted ? "fa-video-slash" : "fa-video"
						}`}
						aria-hidden='true'
						title='Start / Stop camera'></i>
					<i
						onClick={() => this.executeCommand("toggleShareScreen")}
						className='fas fa-film fa-2x grey-color'
						aria-hidden='true'
						title='Share your screen'></i>
				</div>
			</>
		);
	}
}
