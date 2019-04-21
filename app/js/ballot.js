'use strict';

import { loadData, zeroIndex, createPDF } from './helpers';
import dragula from 'dragula';

(() => {

    const points = [12, 10, 8, 7, 6, 5, 4, 3, 2, 1];
    let drake;

    const init = () => {
        initTabs();
        setUpBallot();
        initEvents();
    }

    const setUpBallot = () => {
        buildDataRows();
    }

    const initEvents = () => {
        document.querySelector('.btn__reset').addEventListener('click', resetBallots);
        document.querySelector('.btn__download').addEventListener('click', setUpPDF);
    }

    const buildDataRows = () => {
        document.querySelectorAll('.semifinal').forEach(semi => {
            let data = loadData(semi.getAttribute('data-file'));
            let string = '',
                flag, country, artist, order;

                data.forEach(song => {
                    order = zeroIndex(song.order);
                    flag = song.flag ? song.flag : '';
                    country = song.country.toUpperCase();
                    artist = song.artist.toUpperCase();
                    string += `<tr class="song">
                        <td>
                            <strong class="song__order">${order}</strong>
                            </td>
                            <td class="song__country">
                            <span class="song__country__flag">${flag}</span>
                            <span class="song__country__country">${country}</span>
                            </td>
                            <td class="song__data">
                            <strong class="song__data__artist">${artist}</strong>
                            <span class="small song__data__title">${song.song}</span>
                        </td>
                    </tr>`;
                });
                semi.querySelector('.options div').innerHTML = '<table><tbody class="songs-list">' + string + '</tbody></table>';
                initDragHandlers(semi);
        });
    }

    const initDragHandlers = semifinal => {
        drake = dragula([semifinal.querySelector('.songs-list'), semifinal.querySelector('.chosen-songs')], {
            accepts: (el, target, source, sibling) => {
                if (target.classList.contains('chosen-songs') && target.querySelectorAll('tr').length === points.length && source.classList.contains('songs-list')) {
                    return false;
                }
                return true;
            }
        });

        drake.on('over', (el, container, source) => {
            if (container.classList.contains('chosen-songs')) {
                semifinal.querySelector('.placeholder').classList.add('hidden');
            }
        });

        drake.on('out', (el, container, source) => {
            if (container.querySelectorAll('tr').length === 0) {
                semifinal.querySelector('.placeholder').classList.remove('hidden');
            }
        });

        drake.on('drop', (el, container, source) => {
            setPoints(semifinal.querySelector('.chosen-songs'));
            if (container.classList.contains('songs-list')) {
                hidePoints(el);
            }
            if (semifinal.querySelectorAll('.chosen-songs tr').length === points.length) {
                semifinal.querySelector('.songs-list').classList.add('disabled');
            } else {
                semifinal.querySelector('.songs-list').classList.remove('disabled');
            }
        });
    }

    const removeDragHandlers = () => {
        drake.destroy();
    }

    const resetBallots = () => {
        removeDragHandlers();
        document.querySelectorAll('.chosen-songs').forEach(div => {
            div.innerHTML = '';
        });
        buildDataRows();
    }

    const setPoints = table => {
        let index = 0,
            pointsDiv;
        table.querySelectorAll('tr').forEach(song => {
            let songId = song.querySelector('td');
            pointsDiv = songId.querySelector('.song__points');
            songId.querySelector('.song__order').classList.add('hidden');
            if (pointsDiv) {
                pointsDiv.classList.remove('hidden');
                pointsDiv.innerHTML = points[index] + 'p';
            } else {
                songId.innerHTML += '<span class="song__points">' + points[index] + 'p';
            }
            index++;
        });
    }

    const hidePoints = song => {
        song.querySelector('.song__points').classList.add('hidden');
        song.querySelector('.song__order').classList.remove('hidden');
    }

    const initTabs = () => {
        document.querySelectorAll('.tab-link').forEach(link => link.addEventListener('click', navigateTab));
    }

    const navigateTab = e => {
        e.preventDefault();

        const link = e.target.getAttribute('href');
        document.querySelectorAll('.tab-link').forEach(tabLink => tabLink.parentNode.classList.remove('active'));
        e.target.parentNode.classList.add('active');

        document.querySelectorAll('.semifinal').forEach(tab => tab.classList.add('hidden'));
        document.querySelector(link).classList.remove('hidden');
    }

    const setUpPDF = () => {
        let data = [];

        document.querySelectorAll('.semifinal').forEach(semi => data.push(semi.querySelector('.chosen-songs')));
        createPDF(extractHTML(data));
    }

    const extractHTML = data => {
        let extracted = [];
        data.forEach(semi => {
            let semiObject = [];
            semi.querySelectorAll('tr').forEach(song => {
                let songObject = {};
                songObject.points = song.querySelector('.song__points').innerText;
                songObject.country = song.querySelector('.song__country__country').innerText;
                songObject.artist = song.querySelector('.song__data__artist').innerText;
                songObject.title = song.querySelector('.song__data__title').innerText;
                semiObject.push(songObject);
            });
            extracted.push(semiObject);
        });
        return extracted;
    }

    init();

})();