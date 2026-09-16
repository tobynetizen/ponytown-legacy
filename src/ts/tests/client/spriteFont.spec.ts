import { compareCanvases, loadSprites, loadImageAsCanvas, clearCompareResults } from '../lib';
import { expect } from 'chai';
import { WHITE, BLACK } from '@common/colors';
import { fontPal } from '@client/fonts';
import { drawCanvas, ContextSpriteBatch } from '@graphics/contextSpriteBatch';
import { pathTo } from '@server/paths';
import { paletteSpriteSheet } from '@generated/sprites';
import { lineBreak, drawText } from '@graphics/spriteFont';
import { commonPalettes } from '@graphics/graphicsUtils';

const tests = [
	['Tiny Pony Face!', 'ascii.png'],
	['New lines\nanother line', 'newlines.png'],
	['ŚŃĄjGiýŽžĹĺĽľŔŕ', 'special.png'],
	['👃🙂😵😠😐', 'tiny.png'],
	['АаБбВвГг', 'russian.png'],
	['ΑΒΓΔΕΖΗΘ', 'greek.png'],
	['ぁあぃいぅうぇえ', 'hiragana.png'],
	['ァアィイゥウェエ', 'katakana.png'],
	['漢字', 'kanji.png'],
	['ＡＢＣＤＥＦａｂｃｄｅｆ', 'romaji.png'],
	['emoji: 💚🍎🌠🎲', 'emoji.png'],
	['◠◡◯◰▤▥▦●', 'shapes.png'],
	['abcde\ufe0efg\ufe0fhij', 'variants.png'],
	['‒⁇;⁈⁉“_”.,`', 'punctuation.png'],
	['口古句另叨 龈龋龍龟', 'chinese.png'],
];

describe('SpriteFont', () => {
	before(loadSprites);
	before(() => clearCompareResults('font'));

	describe('drawText()', () => {
		const width = 100;
		const height = 30;

		function test(file: string, draw: (batch: ContextSpriteBatch) => void) {
			const filePath = pathTo('test-fixtures', 'font', file);
			const expected = loadImageAsCanvas(filePath);
			const actual = drawCanvas(width, height, paletteSpriteSheet, WHITE, draw);
			compareCanvases(expected, actual, filePath, 'font');
		}

		tests.forEach(([text, file]) => it(`correct for "${text}" (${file})`, () => {
			test(file, batch => drawText(batch, text, fontPal, BLACK, 5, 5, {
				palette: commonPalettes.mainFont.white, emojiPalette: commonPalettes.mainFont.emoji
			}));
		}));

		describe('lineBreak()', () => {
			it('does not break short text', () => {
				const text = lineBreak('hello world', fontPal, 90);
				expect(text).equal('hello world');
			});

			it('breaks into multiple lines', () => {
				const text = lineBreak('this text is too long to fit', fontPal, 90);
				expect(text).equal('this text is too\nlong to fit');
			});

			it('does not break single word', () => {
				const text = lineBreak('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', fontPal, 90);
				expect(text).equal('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
			});
		});
	});
});
