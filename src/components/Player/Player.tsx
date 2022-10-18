import React from 'react';
import { useAudioHook } from '../../useAudioHook';
import styles from './styles.module.scss';
import classNames from 'classnames';

type PlayerProps = {
    children: (arg: {
        playing: boolean;
        play: () => Promise<void>;
        pause: () => void;
    }) => React.ReactNode;
};

export function Player({ children }: PlayerProps) {
    const { playing, play, pause } = useAudioHook('/miami-nights-keep-running.mp3', true);
    return (
        <>
        <div className={classNames(styles.player, "color-1")}>
            <img className={styles.button} style={{ display: !playing ? 'block' : 'none' }} onClick={play} src="/play.png" />
            <img className={styles.button} style={{ display: playing ? 'block' : 'none' }} onClick={pause} src="/pause.png" />
            {playing && "Miami Nights - Keep Running"}
            {!playing && "Paused"}
        </div>
        {children({ playing, pause, play })}
        </>
    )
}