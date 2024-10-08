import type {FtypBox} from './boxes/iso-base-media/ftyp';
import type {MdhdBox} from './boxes/iso-base-media/mdhd';
import type {MoovBox} from './boxes/iso-base-media/moov/moov';
import type {MvhdBox} from './boxes/iso-base-media/mvhd';
import type {CttsBox} from './boxes/iso-base-media/stsd/ctts';
import type {StcoBox} from './boxes/iso-base-media/stsd/stco';
import type {StscBox} from './boxes/iso-base-media/stsd/stsc';
import type {StsdBox} from './boxes/iso-base-media/stsd/stsd';
import type {StssBox} from './boxes/iso-base-media/stsd/stss';
import type {StszBox} from './boxes/iso-base-media/stsd/stsz';
import type {SttsBox} from './boxes/iso-base-media/stsd/stts';
import type {TkhdBox} from './boxes/iso-base-media/tkhd';
import type {TrakBox} from './boxes/iso-base-media/trak/trak';
import type {MainSegment} from './boxes/webm/segments/main';
import type {TimestampScaleSegment} from './boxes/webm/segments/timestamp-scale';
import type {
	AudioSegment,
	ClusterSegment,
	CodecSegment,
	DisplayHeightSegment,
	DisplayWidthSegment,
	HeightSegment,
	TrackEntrySegment,
	TrackTypeSegment,
	VideoSegment,
	WidthSegment,
} from './boxes/webm/segments/track-entry';
import type {AnySegment, RegularBox} from './parse-result';

export const getFtypBox = (segments: AnySegment[]): FtypBox | null => {
	const ftypBox = segments.find((s) => s.type === 'ftyp-box');
	if (!ftypBox || ftypBox.type !== 'ftyp-box') {
		return null;
	}

	return ftypBox;
};

export const getMoovBox = (segments: AnySegment[]): MoovBox | null => {
	const moovBox = segments.find((s) => s.type === 'moov-box');
	if (!moovBox || moovBox.type !== 'moov-box') {
		return null;
	}

	return moovBox;
};

export const getMvhdBox = (moovBox: MoovBox): MvhdBox | null => {
	const mvHdBox = moovBox.children.find((s) => s.type === 'mvhd-box');

	if (!mvHdBox || mvHdBox.type !== 'mvhd-box') {
		return null;
	}

	return mvHdBox;
};

export const getTraks = (moovBox: MoovBox): TrakBox[] => {
	return moovBox.children.filter((s) => s.type === 'trak-box') as TrakBox[];
};

export const getTkhdBox = (trakBox: TrakBox): TkhdBox | null => {
	const tkhdBox = trakBox.children.find(
		(s) => s.type === 'tkhd-box',
	) as TkhdBox | null;

	return tkhdBox;
};

export const getMdiaBox = (trakBox: TrakBox): RegularBox | null => {
	const mdiaBox = trakBox.children.find(
		(s) => s.type === 'regular-box' && s.boxType === 'mdia',
	);

	if (!mdiaBox || mdiaBox.type !== 'regular-box') {
		return null;
	}

	return mdiaBox;
};

export const getMdhdBox = (trakBox: TrakBox): MdhdBox | null => {
	const mdiaBox = getMdiaBox(trakBox);

	if (!mdiaBox) {
		return null;
	}

	const mdhdBox = mdiaBox.children.find(
		(c) => c.type === 'mdhd-box',
	) as MdhdBox | null;

	return mdhdBox;
};

export const getStblBox = (trakBox: TrakBox): RegularBox | null => {
	const mdiaBox = getMdiaBox(trakBox);

	if (!mdiaBox) {
		return null;
	}

	const minfBox = mdiaBox.children.find(
		(s) => s.type === 'regular-box' && s.boxType === 'minf',
	);

	if (!minfBox || minfBox.type !== 'regular-box') {
		return null;
	}

	const stblBox = minfBox.children.find(
		(s) => s.type === 'regular-box' && s.boxType === 'stbl',
	);

	if (!stblBox || stblBox.type !== 'regular-box') {
		return null;
	}

	return stblBox;
};

export const getStsdBox = (trakBox: TrakBox): StsdBox | null => {
	const stblBox = getStblBox(trakBox);

	if (!stblBox || stblBox.type !== 'regular-box') {
		return null;
	}

	const stsdBox = stblBox.children.find(
		(s) => s.type === 'stsd-box',
	) as StsdBox | null;

	return stsdBox;
};

export const getVideoDescriptors = (trakBox: TrakBox): Uint8Array | null => {
	const stsdBox = getStsdBox(trakBox);

	if (!stsdBox) {
		return null;
	}

	const descriptors = stsdBox.samples.map((s) => {
		return s.type === 'video'
			? s.descriptors.map((d) => {
					return d.type === 'avcc-box'
						? d.description
						: d.type === 'hvcc-box'
							? d.data
							: null;
				})
			: [];
	});

	return descriptors.flat(1).filter(Boolean)[0] ?? null;
};

export const getStcoBox = (trakBox: TrakBox): StcoBox | null => {
	const stblBox = getStblBox(trakBox);

	if (!stblBox || stblBox.type !== 'regular-box') {
		return null;
	}

	const stcoBox = stblBox.children.find(
		(s) => s.type === 'stco-box',
	) as StcoBox | null;

	return stcoBox;
};

export const getSttsBox = (trakBox: TrakBox): SttsBox | null => {
	const stblBox = getStblBox(trakBox);

	if (!stblBox || stblBox.type !== 'regular-box') {
		return null;
	}

	const sttsBox = stblBox.children.find(
		(s) => s.type === 'stts-box',
	) as SttsBox | null;

	return sttsBox;
};

export const getCttsBox = (trakBox: TrakBox): CttsBox | null => {
	const stblBox = getStblBox(trakBox);

	if (!stblBox || stblBox.type !== 'regular-box') {
		return null;
	}

	const cttsBox = stblBox.children.find(
		(s) => s.type === 'ctts-box',
	) as CttsBox | null;

	return cttsBox;
};

export const getStszBox = (trakBox: TrakBox): StszBox | null => {
	const stblBox = getStblBox(trakBox);

	if (!stblBox || stblBox.type !== 'regular-box') {
		return null;
	}

	const stszBox = stblBox.children.find(
		(s) => s.type === 'stsz-box',
	) as StszBox | null;

	return stszBox;
};

export const getStscBox = (trakBox: TrakBox): StscBox | null => {
	const stblBox = getStblBox(trakBox);

	if (!stblBox || stblBox.type !== 'regular-box') {
		return null;
	}

	const stcoBox = stblBox.children.find(
		(b) => b.type === 'stsc-box',
	) as StscBox | null;

	return stcoBox;
};

export const getStssBox = (trakBox: TrakBox): StssBox | null => {
	const stblBox = getStblBox(trakBox);

	if (!stblBox || stblBox.type !== 'regular-box') {
		return null;
	}

	const stssBox = stblBox.children.find(
		(b) => b.type === 'stss-box',
	) as StssBox | null;

	return stssBox;
};

export const getClusterSegment = (
	segment: MainSegment,
): ClusterSegment | null => {
	const clusterSegment = segment.children.find(
		(b) => b.type === 'cluster-segment',
	) as ClusterSegment | undefined;

	return clusterSegment ?? null;
};

export const getTracksSegment = (segment: MainSegment) => {
	const tracksSegment = segment.children.find(
		(b) => b.type === 'tracks-segment',
	);
	if (!tracksSegment || tracksSegment.type !== 'tracks-segment') {
		return null;
	}

	return tracksSegment;
};

export const getTimescaleSegment = (
	segment: MainSegment,
): TimestampScaleSegment | null => {
	const infoSegment = segment.children.find((b) => b.type === 'info-segment');

	if (!infoSegment || infoSegment.type !== 'info-segment') {
		return null;
	}

	const timescale = infoSegment.children.find(
		(b) => b.type === 'timestamp-scale-segment',
	);

	if (!timescale || timescale.type !== 'timestamp-scale-segment') {
		return null;
	}

	return timescale;
};

export const getVideoSegment = (
	track: TrackEntrySegment,
): VideoSegment | null => {
	const videoSegment = track.children.find((b) => b.type === 'video-segment');
	if (!videoSegment || videoSegment.type !== 'video-segment') {
		return null;
	}

	return videoSegment ?? null;
};

export const getAudioSegment = (
	track: TrackEntrySegment,
): AudioSegment | null => {
	const audioSegment = track.children.find((b) => b.type === 'audio-segment');
	if (!audioSegment || audioSegment.type !== 'audio-segment') {
		return null;
	}

	return audioSegment ?? null;
};

export const getSampleRate = (track: TrackEntrySegment): number | null => {
	const audioSegment = getAudioSegment(track);
	if (!audioSegment) {
		return null;
	}

	const samplingFrequency = audioSegment.children.find(
		(b) => b.type === 'sampling-frequency-segment',
	);

	if (
		!samplingFrequency ||
		samplingFrequency.type !== 'sampling-frequency-segment'
	) {
		return null;
	}

	return samplingFrequency.samplingFrequency;
};

export const getNumberOfChannels = (track: TrackEntrySegment): number => {
	const audioSegment = getAudioSegment(track);
	if (!audioSegment) {
		throw new Error('Could not find audio segment');
	}

	const channels = audioSegment.children.find(
		(b) => b.type === 'channels-segment',
	);

	if (!channels || channels.type !== 'channels-segment') {
		return 1;
	}

	return channels.channels;
};

export const getBitDepth = (track: TrackEntrySegment): number | null => {
	const audioSegment = getAudioSegment(track);
	if (!audioSegment) {
		return null;
	}

	const bitDepth = audioSegment.children.find(
		(b) => b.type === 'bit-depth-segment',
	);

	if (!bitDepth || bitDepth.type !== 'bit-depth-segment') {
		return null;
	}

	return bitDepth.bitDepth;
};

export const getPrivateData = (track: TrackEntrySegment): Uint8Array | null => {
	const privateData = track.children.find(
		(b) => b.type === 'codec-private-segment',
	);

	if (!privateData || privateData.type !== 'codec-private-segment') {
		return null;
	}

	return privateData.codecPrivateData;
};

export const getWidthSegment = (
	track: TrackEntrySegment,
): WidthSegment | null => {
	const videoSegment = getVideoSegment(track);
	if (!videoSegment) {
		return null;
	}

	const width = videoSegment.children.find((b) => b.type === 'width-segment');

	if (!width || width.type !== 'width-segment') {
		return null;
	}

	return width;
};

export const getHeightSegment = (
	track: TrackEntrySegment,
): HeightSegment | null => {
	const videoSegment = getVideoSegment(track);
	if (!videoSegment) {
		return null;
	}

	const height = videoSegment.children.find((b) => b.type === 'height-segment');

	if (!height || height.type !== 'height-segment') {
		return null;
	}

	return height;
};

export const getDisplayWidthSegment = (
	track: TrackEntrySegment,
): DisplayWidthSegment | null => {
	const videoSegment = getVideoSegment(track);
	if (!videoSegment) {
		return null;
	}

	const displayWidth = videoSegment.children.find(
		(b) => b.type === 'display-width-segment',
	);

	if (!displayWidth || displayWidth.type !== 'display-width-segment') {
		return null;
	}

	return displayWidth;
};

export const getDisplayHeightSegment = (
	track: TrackEntrySegment,
): DisplayHeightSegment | null => {
	const videoSegment = getVideoSegment(track);
	if (!videoSegment) {
		return null;
	}

	const displayHeight = videoSegment.children.find(
		(b) => b.type === 'display-height-segment',
	);

	if (!displayHeight || displayHeight.type !== 'display-height-segment') {
		return null;
	}

	return displayHeight;
};

export const getTrackTypeSegment = (
	track: TrackEntrySegment,
): TrackTypeSegment | null => {
	const trackType = track.children.find((b) => b.type === 'track-type-segment');
	if (!trackType || trackType.type !== 'track-type-segment') {
		return null;
	}

	return trackType;
};

export const getTrackId = (track: TrackEntrySegment): number => {
	const trackId = track.children.find((b) => b.type === 'track-number-segment');
	if (!trackId || trackId.type !== 'track-number-segment') {
		throw new Error('Expected track number segment');
	}

	return trackId.trackNumber;
};

export const getCodecSegment = (
	track: TrackEntrySegment,
): CodecSegment | null => {
	const codec = track.children.find((b) => b.type === 'codec-segment');
	if (!codec || codec.type !== 'codec-segment') {
		return null;
	}

	return codec;
};

export const hasSkippedMdatProcessing = (anySegment: AnySegment[]) => {
	const mdat = anySegment.find((b) => b.type === 'mdat-box');
	if (!mdat) {
		return {
			skipped: false as const,
		};
	}

	if (mdat.type !== 'mdat-box') {
		throw new Error('Expected mdat-box');
	}

	if (mdat.samplesProcessed) {
		return {
			skipped: false as const,
		};
	}

	return {
		skipped: true,
		fileOffset: mdat.fileOffset,
	};
};
