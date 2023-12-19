import type {ChangeEvent} from 'react';
import React, {useCallback} from 'react';
import {Checkbox} from '../Checkbox';
import {Spacing} from '../layout';
import {label, optionRow, rightRow} from './layout';
import {OptionExplainerBubble} from './OptionExplainerBubble';

export const EnforceAudioTrackSetting: React.FC<{
	enforceAudioTrack: boolean;
	setEnforceAudioTrack: React.Dispatch<React.SetStateAction<boolean>>;
	muted: boolean;
}> = ({enforceAudioTrack, muted, setEnforceAudioTrack}) => {
	const onEnforceAudioTrackChanged = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setEnforceAudioTrack(e.target.checked);
		},
		[setEnforceAudioTrack],
	);

	return (
		<div style={optionRow}>
			<div style={label}>
				Enforce Audio Track
				<Spacing x={0.5} />
				<OptionExplainerBubble id="enforceAudioOption" />
			</div>

			<div style={rightRow}>
				<Checkbox
					disabled={muted && !enforceAudioTrack}
					checked={enforceAudioTrack}
					onChange={onEnforceAudioTrackChanged}
					name="enforce-audio-track"
				/>
			</div>
		</div>
	);
};
