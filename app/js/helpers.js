'use strict';

import one from '../data/2019/1.json';
import two from '../data/2019/2.json';

import jsPDF from 'jspdf';

const mapFiles = () => {
    return {
        '1': one,
        '2': two
    }
}

export const loadData = filename => {
    return mapFiles()[filename].songs;
}

export const zeroIndex = number => {
    if (number.toString().length === 1) {
        return '0' + number;
    }

    return number;
}

export const createPDF = data => {
    let doc = new jsPDF('p', 'pt'),
        position = 80,
        index = 1;

    doc.setFontSize(36);
    doc.text(20, 50, 'Eurovision ballot');

    data.forEach(semi => {
        doc.setFontSize(22);
        doc.text(20, position, 'Semi final ' + index);
        semi.forEach(song => {
            doc.setFontSize(12);
            doc.text(20, position += 20, song.points + ': ' + song.country + ': ' + song.artist + ' - ' + song.title);
        });
        if (index < data.length) {
            doc.addPage();
            position = 50;
        }
        index += 1;
    });

    doc.save('ballot.pdf');
}