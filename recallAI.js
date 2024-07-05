const axios = require('axios');
let data = JSON.stringify({
  "real_time_media": {
    "rtmp_destination_url": "string",
    "websocket_video_destination_url": "string",
    "websocket_audio_destination_url": "string",
    "websocket_speaker_timeline_destination_url": "string",
    "websocket_speaker_timeline_exclude_null_speaker": true,
    "webhook_call_events_destination_url": "string",
    "webhook_chat_messages_destination_url": "string"
  },
  "automatic_leave": {
    "silence_detection": {
      "timeout": 36000,
      "activate_after": 12000
    },
    "bot_detection": {
      "using_participant_events": {
        "timeout": 10000,
        "activate_after": 10000
      },
      "using_participant_names": {
        "timeout": 10000,
        "activate_after": 10000,
        "matches": [
          "string"
        ]
      }
    },
    "waiting_room_timeout": 120000,
    "noone_joined_timeout": 120000,
    "everyone_left_timeout": 2000,
    "in_call_not_recording_timeout": 3600,
    "in_call_recording_timeout": 10000,
    "recording_permission_denied_timeout": 36000
  },
  "automatic_audio_output": {
    "in_call_recording": {
      "data": {
        "kind": "mp3",
        "b64_data": "..."
      },
      "replay_on_participant_join": {
        "debounce_mode": "trailing",
        "debounce_interval": 0,
        "disable_after": 0
      }
    }
  },
  "recording_mode_options": {
    "start_recording_on": "call_join"
  },
  "meeting_url": "https://teams.live.com/meet/9582118447089?p=xsMiYQpC2tiXHyIr",
  "bot_name": "PlannerPal Test",
  "recording_mode": "speaker_view",
  "join_at":new Date().toISOString()
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://us-west-2.recall.ai/api/v1/bot/',
  headers: { 
    'Authorization': 'Token 477845b58709973c379a83d4accce98e4b51bdd4', 
    'accept': 'application/json', 
    'content-type': 'application/json'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
