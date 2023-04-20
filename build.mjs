import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {readdir} from 'node:fs/promises';
import CopyPlugin from 'copy-webpack-plugin';

function getGameNavPageConfig(roms) {
    return {
        entry: './src/index.js',
        mode: 'production',
        output: {
            clean: true,
            path: path.resolve('./dist')
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: 'src/game-nav.ejs',
                filename: 'index.html',
                templateParameters: {roms}
            }),
            new CopyPlugin({
                patterns: [
                    {from: 'roms'}
                ]
            })
        ]
    };
}


function getGamingPageConfig(roms) {
    return {
        entry: './src/index.js',
        mode: 'production',
        output: {
            path: path.resolve('./dist')
        },
        plugins: [
            ...roms.map(i => {
                return new HtmlWebpackPlugin({
                    template: 'src/gaming.ejs',
                    filename: `${i}.html`,
                    templateParameters: {rom: i}
                });
            })
        ]
    };
}

const roms = await readdir(path.resolve('./roms'));

webpack(
    [
        getGameNavPageConfig(roms),
        getGamingPageConfig(roms)
    ],
    (err, stats) => {
        if (err || stats.hasErrors()) {
            process.stderr.print(err);
            return;
        }
        process.stdout.write(stats.toString() + '\n');
        // Done processing
    }
);
