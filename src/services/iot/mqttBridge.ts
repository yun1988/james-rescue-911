/**
 * MQTT Bridge - Reserved for future ESP32 / AWS IoT Core integration.
 *
 * Future setup:
 * 1. AWS IoT Core: Create thing, policy, certificates
 * 2. Topic design: james-rescue-911/disturbance/{deviceId}
 * 3. Payload: { "who": "Todd", "level": "Emergency" }
 * 4. Use mqtt.js or aws-iot-device-sdk-v2 to subscribe
 * 5. On message received -> call disturberService.insertDisturbance() with source: "mqtt"
 *
 * Example (pseudo):
 *
 * import mqtt from 'mqtt';
 * import { disturberController } from '@/controllers/disturberController';
 *
 * const client = mqtt.connect('wss://xxx.iot.region.amazonaws.com/mqtt', {
 *   clientId: 'james-rescue-dashboard',
 *   // ... certs
 * });
 *
 * client.on('connect', () => {
 *   client.subscribe('james-rescue-911/disturbance/+');
 * });
 *
 * client.on('message', (topic, payload) => {
 *   const { who, level } = JSON.parse(payload.toString());
 *   disturberController.reportDisturbance({ who, level }, 'mqtt');
 * });
 */

export const MQTT_TOPIC_PREFIX = 'james-rescue-911/disturbance';

export interface MQTTDisturbancePayload {
  who: 'B' | 'Todd' | 'CJ';
  level?: 'Emergency' | 'Normal' | 'Low';
}
