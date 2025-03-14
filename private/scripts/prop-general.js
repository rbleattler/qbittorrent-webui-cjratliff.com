/*
 * Bittorrent Client using Qt and libtorrent.
 * Copyright (C) 2009  Christophe Dumez <chris@qbittorrent.org>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * In addition, as a special exception, the copyright holders give permission to
 * link this program with the OpenSSL project's "OpenSSL" library (or with
 * modified versions of it that use the same license as the "OpenSSL" library),
 * and distribute the linked executables. You must obey the GNU General Public
 * License in all respects for all of the code used other than "OpenSSL".  If you
 * modify file(s), you may extend this exception to your version of the file(s),
 * but you are not obligated to do so. If you do not wish to do so, delete this
 * exception statement from your version.
 */

"use strict";

window.qBittorrent ??= {};
window.qBittorrent.PropGeneral ??= (() => {
    const exports = () => {
        return {
            updateData: updateData
        };
    };

    const piecesBar = new window.qBittorrent.PiecesBar.PiecesBar([], {
        height: 16
    });
    $("progress").appendChild(piecesBar);

    const clearData = function() {
        $("time_elapsed").textContent = "";
        $("eta").textContent = "";
        $("nb_connections").textContent = "";
        $("total_downloaded").textContent = "";
        $("total_uploaded").textContent = "";
        $("dl_speed").textContent = "";
        $("up_speed").textContent = "";
        $("dl_limit").textContent = "";
        $("up_limit").textContent = "";
        $("total_wasted").textContent = "";
        $("seeds").textContent = "";
        $("peers").textContent = "";
        $("share_ratio").textContent = "";
        $("popularity").textContent = "";
        $("reannounce").textContent = "";
        $("last_seen").textContent = "";
        $("total_size").textContent = "";
        $("pieces").textContent = "";
        $("created_by").textContent = "";
        $("addition_date").textContent = "";
        $("completion_date").textContent = "";
        $("creation_date").textContent = "";
        $("torrent_hash_v1").textContent = "";
        $("torrent_hash_v2").textContent = "";
        $("save_path").textContent = "";
        $("comment").textContent = "";
        $("private").textContent = "";
        piecesBar.clear();
    };

    let loadTorrentDataTimer = -1;
    const loadTorrentData = function() {
        if ($("propGeneral").hasClass("invisible")
            || $("propertiesPanel_collapseToggle").hasClass("panel-expand")) {
            // Tab changed, don't do anything
            return;
        }
        const current_id = torrentsTable.getCurrentTorrentID();
        if (current_id === "") {
            clearData();
            clearTimeout(loadTorrentDataTimer);
            loadTorrentDataTimer = loadTorrentData.delay(5000);
            return;
        }
        const url = new URI("api/v2/torrents/properties?hash=" + current_id);
        new Request.JSON({
            url: url,
            method: "get",
            noCache: true,
            onFailure: function() {
                $("error_div").textContent = "qBittorrent client is not reachable";
                clearTimeout(loadTorrentDataTimer);
                loadTorrentDataTimer = loadTorrentData.delay(10000);
            },
            onSuccess: function(data) {
                $("error_div").textContent = "";
                if (data) {
                    // Update Torrent data

                    const timeElapsed = (data.seeding_time > 0)
                        ? "%1 (seeded for %2)"
                        .replace("%1", window.qBittorrent.Misc.friendlyDuration(data.time_elapsed))
                        .replace("%2", window.qBittorrent.Misc.friendlyDuration(data.seeding_time))
                        : window.qBittorrent.Misc.friendlyDuration(data.time_elapsed);
                    $("time_elapsed").textContent = timeElapsed;

                    $("eta").textContent = window.qBittorrent.Misc.friendlyDuration(data.eta, window.qBittorrent.Misc.MAX_ETA);

                    const nbConnections = "%1 (%2 max)"
                        .replace("%1", data.nb_connections)
                        .replace("%2", ((data.nb_connections_limit < 0) ? "∞" : data.nb_connections_limit));
                    $("nb_connections").textContent = nbConnections;

                    const totalDownloaded = "%1 (%2 this session)"
                        .replace("%1", window.qBittorrent.Misc.friendlyUnit(data.total_downloaded))
                        .replace("%2", window.qBittorrent.Misc.friendlyUnit(data.total_downloaded_session));
                    $("total_downloaded").textContent = totalDownloaded;

                    const totalUploaded = "%1 (%2 this session)"
                        .replace("%1", window.qBittorrent.Misc.friendlyUnit(data.total_uploaded))
                        .replace("%2", window.qBittorrent.Misc.friendlyUnit(data.total_uploaded_session));
                    $("total_uploaded").textContent = totalUploaded;

                    const dlSpeed = "%1 (%2 avg.)"
                        .replace("%1", window.qBittorrent.Misc.friendlyUnit(data.dl_speed, true))
                        .replace("%2", window.qBittorrent.Misc.friendlyUnit(data.dl_speed_avg, true));
                    $("dl_speed").textContent = dlSpeed;

                    const upSpeed = "%1 (%2 avg.)"
                        .replace("%1", window.qBittorrent.Misc.friendlyUnit(data.up_speed, true))
                        .replace("%2", window.qBittorrent.Misc.friendlyUnit(data.up_speed_avg, true));
                    $("up_speed").textContent = upSpeed;

                    const dlLimit = (data.dl_limit === -1)
                        ? "∞"
                        : window.qBittorrent.Misc.friendlyUnit(data.dl_limit, true);
                    $("dl_limit").textContent = dlLimit;

                    const upLimit = (data.up_limit === -1)
                        ? "∞"
                        : window.qBittorrent.Misc.friendlyUnit(data.up_limit, true);
                    $("up_limit").textContent = upLimit;

                    $("total_wasted").textContent = window.qBittorrent.Misc.friendlyUnit(data.total_wasted);

                    const seeds = "%1 (%2 total)"
                        .replace("%1", data.seeds)
                        .replace("%2", data.seeds_total);
                    $("seeds").textContent = seeds;

                    const peers = "%1 (%2 total)"
                        .replace("%1", data.peers)
                        .replace("%2", data.peers_total);
                    $("peers").textContent = peers;

                    $("share_ratio").textContent = data.share_ratio.toFixed(2);

                    $("popularity").textContent = data.popularity.toFixed(2);

                    $("reannounce").textContent = window.qBittorrent.Misc.friendlyDuration(data.reannounce);

                    const lastSeen = (data.last_seen >= 0)
                        ? new Date(data.last_seen * 1000).toLocaleString()
                        : "Never";
                    $("last_seen").textContent = lastSeen;

                    const totalSize = (data.total_size >= 0) ? window.qBittorrent.Misc.friendlyUnit(data.total_size) : "";
                    $("total_size").textContent = totalSize;

                    const pieces = (data.pieces_num >= 0)
                        ? "%1 x %2 (have %3)"
                        .replace("%1", data.pieces_num)
                        .replace("%2", window.qBittorrent.Misc.friendlyUnit(data.piece_size))
                        .replace("%3", data.pieces_have)
                        : "";
                    $("pieces").textContent = pieces;

                    $("created_by").textContent = data.created_by;

                    const additionDate = (data.addition_date >= 0)
                        ? new Date(data.addition_date * 1000).toLocaleString()
                        : "Unknown";
                    $("addition_date").textContent = additionDate;

                    const completionDate = (data.completion_date >= 0)
                        ? new Date(data.completion_date * 1000).toLocaleString()
                        : "";
                    $("completion_date").textContent = completionDate;

                    const creationDate = (data.creation_date >= 0)
                        ? new Date(data.creation_date * 1000).toLocaleString()
                        : "";
                    $("creation_date").textContent = creationDate;

                    const torrentHashV1 = (data.infohash_v1 !== "")
                        ? data.infohash_v1
                        : "N/A";
                    $("torrent_hash_v1").textContent = torrentHashV1;

                    const torrentHashV2 = (data.infohash_v2 !== "")
                        ? data.infohash_v2
                        : "N/A";
                    $("torrent_hash_v2").textContent = torrentHashV2;

                    $("save_path").textContent = data.save_path;

                    $("comment").innerHTML = window.qBittorrent.Misc.parseHtmlLinks(window.qBittorrent.Misc.escapeHtml(data.comment));

                    $("private").textContent = (data.has_metadata
                        ? (data.private
                            ? "Yes"
                            : "No")
                        : "N/A");
                }
                else {
                    clearData();
                }
                clearTimeout(loadTorrentDataTimer);
                loadTorrentDataTimer = loadTorrentData.delay(5000);
            }
        }).send();

        const piecesUrl = new URI("api/v2/torrents/pieceStates?hash=" + current_id);
        new Request.JSON({
            url: piecesUrl,
            method: "get",
            noCache: true,
            onFailure: function() {
                $("error_div").textContent = "qBittorrent client is not reachable";
                clearTimeout(loadTorrentDataTimer);
                loadTorrentDataTimer = loadTorrentData.delay(10000);
            },
            onSuccess: function(data) {
                $("error_div").textContent = "";

                if (data)
                    piecesBar.setPieces(data);
                else
                    clearData();

                clearTimeout(loadTorrentDataTimer);
                loadTorrentDataTimer = loadTorrentData.delay(5000);
            }
        }).send();
    };

    const updateData = function() {
        clearTimeout(loadTorrentDataTimer);
        loadTorrentDataTimer = -1;
        loadTorrentData();
    };

    return exports();
})();
Object.freeze(window.qBittorrent.PropGeneral);
