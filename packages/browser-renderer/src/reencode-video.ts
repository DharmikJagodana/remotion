import {createEncoder} from './create-encoder';
import {createVideoDecoder} from './create-video-decoder';
import {getDescription} from './get-description';
import {getSamples} from './get-samples';
import {loadMp4File} from './load-mp4-file';

export const reencodeVideo = async (file: File) => {
	const {info, mp4File} = await loadMp4File(file);
	const track = info.videoTracks[0];

	if (!track) {
		throw new Error('No video track found in the file');
	}

	const {encoder, outputMp4} = createEncoder({
		width: track.track_width,
		height: track.track_height,
		onProgress: (encoded) => {
			const encodingProgress = Math.round((100 * encoded) / track.nb_samples);
			console.log(`Encoding frame ${encoded} (${encodingProgress}%)`);
		},
	});
	let nextKeyFrameTimestamp = 0;
	let keyFrame = false;

	const keyFrameEveryHowManySeconds = 2;

	const {decoder} = createVideoDecoder({
		onFrame: (frame) => {
			if (frame.timestamp >= nextKeyFrameTimestamp) {
				keyFrame = true;

				nextKeyFrameTimestamp =
					frame.timestamp + keyFrameEveryHowManySeconds * 1e6;
			}

			encoder.encode(frame, {keyFrame});
			frame.close();
		},
		onProgress: (decoded) => {
			const decodingProgress = Math.round((100 * decoded) / track.nb_samples);
			console.log(`Decoding frame ${decoded} (${decodingProgress}%)`);
		},
	});

	decoder.configure({
		codec: track.codec,
		codedWidth: track.track_width,
		codedHeight: track.track_height,
		// TODO: Check first if hardware acceleration is supported
		hardwareAcceleration: 'prefer-hardware',
		description: getDescription({mp4File, track}),
	});

	const samples = await getSamples({mp4File, track});
	console.log(samples);

	for (const sample of samples) {
		const duration = (sample.duration * 1_000_000) / sample.timescale;
		const timestamp = (sample.cts * 1_000_000) / sample.timescale;

		const chunk = new EncodedVideoChunk({
			type: sample.is_sync ? 'key' : 'delta',
			timestamp,
			duration,
			data: sample.data,
		});

		decoder.decode(chunk);
	}

	await decoder.flush();
	await encoder.flush();
	encoder.close();
	decoder.close();

	outputMp4.save('mp4box.mp4');
};
