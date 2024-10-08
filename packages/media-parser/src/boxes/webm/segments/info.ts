import type {BufferIterator} from '../../../buffer-iterator';
import type {ParserContext} from '../../../parser-context';
import type {MatroskaSegment} from '../segments';
import {expectChildren} from './parse-children';

export type InfoSegment = {
	type: 'info-segment';
	length: number;
	children: MatroskaSegment[];
};

export const parseInfoSegment = async (
	iterator: BufferIterator,
	length: number,
	parserContext: ParserContext,
): Promise<InfoSegment> => {
	const children = await expectChildren({
		iterator,
		length,
		initialChildren: [],
		wrap: null,
		parserContext,
	});

	if (children.status === 'incomplete') {
		throw new Error('Incomplete children');
	}

	return {
		type: 'info-segment',
		length,
		children: children.segments as MatroskaSegment[],
	};
};
