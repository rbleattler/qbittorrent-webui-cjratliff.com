/*
 * Bittorrent Client using Qt and libtorrent.
 * Copyright (C) 2008  Christophe Dumez <chris@qbittorrent.org>
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

/* -----------------------------------------------------------------

    ATTACH MOCHA LINK EVENTS
    Notes: Here is where you define your windows and the events that open them.
    If you are not using links to run Mocha methods you can remove this function.

    If you need to add link events to links within windows you are creating, do
    it in the onContentLoaded function of the new window.

   ----------------------------------------------------------------- */
   "use strict";

   window.qBittorrent ??= {};
   window.qBittorrent.Dialog ??= (() => {
       const exports = () => {
           return {
               baseModalOptions: baseModalOptions
           };
       };
   
       const deepFreeze = (obj) => {
           // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze#examples
           // accounts for circular refs
           const frozen = new WeakSet();
           const deepFreezeSafe = (obj) => {
               if (frozen.has(obj))
                   return;
   
               frozen.add(obj);
   
               const keys = Reflect.ownKeys(obj);
               for (const key of keys) {
                   const value = obj[key];
                   if ((value && (typeof value === "object")) || (typeof value === "function"))
                       deepFreezeSafe(value);
               }
               Object.freeze(obj);
           };
   
           deepFreezeSafe(obj);
       };
   
       const baseModalOptions = Object.assign(Object.create(null), {
           addClass: "modalDialog",
           collapsible: false,
           cornerRadius: 5,
           draggable: true,
           footerHeight: 20,
           icon: "images/qbittorrent-tray.svg",
           loadMethod: "xhr",
           maximizable: false,
           method: "post",
           minimizable: false,
           padding: {
               top: 15,
               right: 10,
               bottom: 15,
               left: 5
           },
           resizable: true,
           width: 480,
           onCloseComplete: function() {
               // make sure overlay is properly hidden upon modal closing
               document.getElementById("modalOverlay").style.display = "none";
           }
       });
   
       deepFreeze(baseModalOptions);
   
       return exports();
   })();
   Object.freeze(window.qBittorrent.Dialog);
   
   const LocalPreferences = new window.qBittorrent.LocalPreferences.LocalPreferencesClass();
   
   let saveWindowSize = function() {};
   let loadWindowWidth = function() {};
   let loadWindowHeight = function() {};
   let showDownloadPage = function() {};
   let globalUploadLimitFN = function() {};
   let uploadLimitFN = function() {};
   let shareRatioFN = function() {};
   let toggleSequentialDownloadFN = function() {};
   let toggleFirstLastPiecePrioFN = function() {};
   let setSuperSeedingFN = function() {};
   let setForceStartFN = function() {};
   let globalDownloadLimitFN = function() {};
   let StatisticsLinkFN = function() {};
   let downloadLimitFN = function() {};
   let deleteSelectedTorrentsFN = function() {};
   let stopFN = function() {};
   let startFN = function() {};
   let autoTorrentManagementFN = function() {};
   let recheckFN = function() {};
   let reannounceFN = function() {};
   let setLocationFN = function() {};
   let renameFN = function() {};
   let renameFilesFN = function() {};
   let startVisibleTorrentsFN = function() {};
   let stopVisibleTorrentsFN = function() {};
   let deleteVisibleTorrentsFN = function() {};
   let torrentNewCategoryFN = function() {};
   let torrentSetCategoryFN = function() {};
   let createCategoryFN = function() {};
   let createSubcategoryFN = function() {};
   let editCategoryFN = function() {};
   let removeCategoryFN = function() {};
   let deleteUnusedCategoriesFN = function() {};
   let torrentAddTagsFN = function() {};
   let torrentSetTagsFN = function() {};
   let torrentRemoveAllTagsFN = function() {};
   let createTagFN = function() {};
   let removeTagFN = function() {};
   let deleteUnusedTagsFN = function() {};
   let startTorrentsByTagFN = function() {};
   let stopTorrentsByTagFN = function() {};
   let deleteTorrentsByTagFN = function() {};
   let startTorrentsByTrackerFN = function() {};
   let stopTorrentsByTrackerFN = function() {};
   let deleteTorrentsByTrackerFN = function() {};
   let deleteTrackerFN = function() {};
   let copyNameFN = function() {};
   let copyInfohashFN = function(policy) {};
   let copyMagnetLinkFN = function() {};
   let copyIdFN = function() {};
   let copyCommentFN = function() {};
   let setQueuePositionFN = function() {};
   let exportTorrentFN = function() {};
   
   const initializeWindows = function() {
       saveWindowSize = function(windowId) {
           const size = $(windowId).getSize();
           LocalPreferences.set("window_" + windowId + "_width", size.x);
           LocalPreferences.set("window_" + windowId + "_height", size.y);
       };
   
       loadWindowWidth = function(windowId, defaultValue) {
           return LocalPreferences.get("window_" + windowId + "_width", defaultValue);
       };
   
       loadWindowHeight = function(windowId, defaultValue) {
           return LocalPreferences.get("window_" + windowId + "_height", defaultValue);
       };
   
       function addClickEvent(el, fn) {
           ["Link", "Button"].each((item) => {
               if ($(el + item))
                   $(el + item).addEventListener("click", fn);
           });
       }
   
       addClickEvent("download", (e) => {
           e.preventDefault();
           e.stopPropagation();
           showDownloadPage();
       });
   
       showDownloadPage = function(urls) {
           const id = "downloadPage";
           const contentUri = new URI("download.html");
   
           if (urls && (urls.length > 0))
               contentUri.setData("urls", urls.map(encodeURIComponent).join("|"));
   
           new MochaUI.Window({
               id: id,
               icon: "images/qbittorrent-tray.svg",
               title: "Download from URLs",
               loadMethod: "iframe",
               contentURL: contentUri.toString(),
               addClass: "windowFrame", // fixes iframe scrolling on iOS Safari
               scrollbars: true,
               maximizable: false,
               closable: true,
               paddingVertical: 0,
               paddingHorizontal: 0,
               width: loadWindowWidth(id, 500),
               height: loadWindowHeight(id, 600),
               onResize: window.qBittorrent.Misc.createDebounceHandler(500, (e) => {
                   saveWindowSize(id);
               })
           });
           updateMainData();
       };
   
       addClickEvent("preferences", (e) => {
           e.preventDefault();
           e.stopPropagation();
   
           const id = "preferencesPage";
           new MochaUI.Window({
               id: id,
               icon: "images/qbittorrent-tray.svg",
               title: "Options",
               loadMethod: "xhr",
               toolbar: true,
               contentURL: new URI("views/preferences.html").toString(),
               require: {
                   css: ["css/Tabs.css"]
               },
               toolbarURL: "views/preferencesToolbar.html",
               maximizable: false,
               closable: true,
               paddingVertical: 0,
               paddingHorizontal: 0,
               width: loadWindowWidth(id, 730),
               height: loadWindowHeight(id, 600),
               onResize: window.qBittorrent.Misc.createDebounceHandler(500, (e) => {
                   saveWindowSize(id);
               })
           });
       });
   
       addClickEvent("manageCookies", (e) => {
           e.preventDefault();
           e.stopPropagation();
   
           const id = "cookiesPage";
           new MochaUI.Window({
               id: id,
               title: "Manage Cookies",
               loadMethod: "xhr",
               contentURL: new URI("views/cookies.html").toString(),
               maximizable: false,
               paddingVertical: 0,
               paddingHorizontal: 0,
               width: loadWindowWidth(id, 900),
               height: loadWindowHeight(id, 400),
               onResize: function() {
                   saveWindowSize(id);
               }
           });
       });
   
       addClickEvent("upload", (e) => {
           e.preventDefault();
           e.stopPropagation();
   
           const id = "uploadPage";
           new MochaUI.Window({
               id: id,
               icon: "images/qbittorrent-tray.svg",
               title: "Upload local torrent",
               loadMethod: "iframe",
               contentURL: new URI("upload.html").toString(),
               addClass: "windowFrame", // fixes iframe scrolling on iOS Safari
               scrollbars: true,
               maximizable: false,
               paddingVertical: 0,
               paddingHorizontal: 0,
               width: loadWindowWidth(id, 500),
               height: loadWindowHeight(id, 460),
               onResize: window.qBittorrent.Misc.createDebounceHandler(500, (e) => {
                   saveWindowSize(id);
               })
           });
           updateMainData();
       });
   
       globalUploadLimitFN = function() {
           new MochaUI.Window({
               id: "uploadLimitPage",
               icon: "images/qbittorrent-tray.svg",
               title: "Global Upload Speed Limit",
               loadMethod: "iframe",
               contentURL: new URI("uploadlimit.html").setData("hashes", "global").toString(),
               scrollbars: false,
               resizable: false,
               maximizable: false,
               paddingVertical: 0,
               paddingHorizontal: 0,
               width: 424,
               height: 100
           });
       };
   
       uploadLimitFN = function() {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length) {
               new MochaUI.Window({
                   id: "uploadLimitPage",
                   icon: "images/qbittorrent-tray.svg",
                   title: "Torrent Upload Speed Limiting",
                   loadMethod: "iframe",
                   contentURL: new URI("uploadlimit.html").setData("hashes", hashes.join("|")).toString(),
                   scrollbars: false,
                   resizable: false,
                   maximizable: false,
                   paddingVertical: 0,
                   paddingHorizontal: 0,
                   width: 424,
                   height: 100
               });
           }
       };
   
       shareRatioFN = function() {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length) {
               let shareRatio = null;
               let torrentsHaveSameShareRatio = true;
   
               // check if all selected torrents have same share ratio
               for (let i = 0; i < hashes.length; ++i) {
                   const hash = hashes[i];
                   const row = torrentsTable.getRow(hash).full_data;
                   const origValues = row.ratio_limit + "|" + row.seeding_time_limit + "|" + row.inactive_seeding_time_limit + "|"
                       + row.max_ratio + "|" + row.max_seeding_time + "|" + row.max_inactive_seeding_time;
   
                   // initialize value
                   if (shareRatio === null)
                       shareRatio = origValues;
   
                   if (origValues !== shareRatio) {
                       torrentsHaveSameShareRatio = false;
                       break;
                   }
               }
   
               // if all torrents have same share ratio, display that share ratio. else use the default
               const orig = torrentsHaveSameShareRatio ? shareRatio : "";
               new MochaUI.Window({
                   id: "shareRatioPage",
                   icon: "images/qbittorrent-tray.svg",
                   title: "Torrent Upload/Download Ratio Limiting",
                   loadMethod: "iframe",
                   contentURL: new URI("shareratio.html").setData("hashes", hashes.join("|")).setData("orig", orig).toString(),
                   scrollbars: false,
                   maximizable: false,
                   paddingVertical: 0,
                   paddingHorizontal: 0,
                   width: 424,
                   height: 220
               });
           }
       };
   
       toggleSequentialDownloadFN = function() {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length) {
               new Request({
                   url: "api/v2/torrents/toggleSequentialDownload",
                   method: "post",
                   data: {
                       hashes: hashes.join("|")
                   }
               }).send();
               updateMainData();
           }
       };
   
       toggleFirstLastPiecePrioFN = function() {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length) {
               new Request({
                   url: "api/v2/torrents/toggleFirstLastPiecePrio",
                   method: "post",
                   data: {
                       hashes: hashes.join("|")
                   }
               }).send();
               updateMainData();
           }
       };
   
       setSuperSeedingFN = function(val) {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length) {
               new Request({
                   url: "api/v2/torrents/setSuperSeeding",
                   method: "post",
                   data: {
                       value: val,
                       hashes: hashes.join("|")
                   }
               }).send();
               updateMainData();
           }
       };
   
       setForceStartFN = function() {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length) {
               new Request({
                   url: "api/v2/torrents/setForceStart",
                   method: "post",
                   data: {
                       value: "true",
                       hashes: hashes.join("|")
                   }
               }).send();
               updateMainData();
           }
       };
   
       globalDownloadLimitFN = function() {
           new MochaUI.Window({
               id: "downloadLimitPage",
               icon: "images/qbittorrent-tray.svg",
               title: "Global Download Speed Limit",
               loadMethod: "iframe",
               contentURL: new URI("downloadlimit.html").setData("hashes", "global").toString(),
               scrollbars: false,
               resizable: false,
               maximizable: false,
               paddingVertical: 0,
               paddingHorizontal: 0,
               width: 424,
               height: 100
           });
       };
   
       StatisticsLinkFN = function() {
           const id = "statisticspage";
           new MochaUI.Window({
               id: id,
               icon: "images/qbittorrent-tray.svg",
               title: "Statistics",
               loadMethod: "xhr",
               contentURL: new URI("views/statistics.html").toString(),
               maximizable: false,
               padding: 10,
               width: loadWindowWidth(id, 285),
               height: loadWindowHeight(id, 415),
               onResize: window.qBittorrent.Misc.createDebounceHandler(500, (e) => {
                   saveWindowSize(id);
               })
           });
       };
   
       downloadLimitFN = function() {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length) {
               new MochaUI.Window({
                   id: "downloadLimitPage",
                   icon: "images/qbittorrent-tray.svg",
                   title: "Torrent Download Speed Limiting",
                   loadMethod: "iframe",
                   contentURL: new URI("downloadlimit.html").setData("hashes", hashes.join("|")).toString(),
                   scrollbars: false,
                   resizable: false,
                   maximizable: false,
                   paddingVertical: 0,
                   paddingHorizontal: 0,
                   width: 424,
                   height: 100
               });
           }
       };
   
       deleteSelectedTorrentsFN = function(forceDeleteFiles = false) {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length > 0) {
            //   if (window.qBittorrent.Cache.preferences.get().confirm_torrent_deletion) {
                   new MochaUI.Modal({
                       ...window.qBittorrent.Dialog.baseModalOptions,
                       id: "confirmDeletionPage",
                       title: "Remove torrent(s)",
                       data: {
                           hashes: hashes,
                           forceDeleteFiles: forceDeleteFiles
                       },
                       contentURL: "views/confirmdeletion.html",
                       onContentLoaded: function(w) {
                           MochaUI.resizeWindow(w, { centered: true });
                           MochaUI.centerWindow(w);
                       },
                       onCloseComplete: function() {
                           // make sure overlay is properly hidden upon modal closing
                           document.getElementById("modalOverlay").style.display = "none";
                       }
                   });
            //    }
            //    else {
            //        new Request({
            //            url: "api/v2/torrents/delete",
            //            method: "post",
            //            data: {
            //                hashes: hashes.join("|"),
            //                deleteFiles: forceDeleteFiles
            //            },
            //            onSuccess: function() {
            //                torrentsTable.deselectAll();
            //                updateMainData();
            //                updatePropertiesPanel();
            //            },
            //            onFailure: function() {
            //                alert("Unable to delete torrents.");
            //            }
            //        }).send();
            //    }
           }
       };
   
       addClickEvent("delete", (e) => {
           e.preventDefault();
           e.stopPropagation();
           deleteSelectedTorrentsFN();
       });
   
       stopFN = function() {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length) {
               new Request({
                   url: "api/v2/torrents/stop",
                   method: "post",
                   data: {
                       hashes: hashes.join("|")
                   }
               }).send();
               updateMainData();
           }
       };
   
       startFN = function() {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length) {
               new Request({
                   url: "api/v2/torrents/start",
                   method: "post",
                   data: {
                       hashes: hashes.join("|")
                   }
               }).send();
               updateMainData();
           }
       };
   
       autoTorrentManagementFN = function() {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length > 0) {
               const enableAutoTMM = hashes.some((hash) => !(torrentsTable.getRow(hash).full_data.auto_tmm));
               if (enableAutoTMM) {
                   new MochaUI.Modal({
                       ...window.qBittorrent.Dialog.baseModalOptions,
                       id: "confirmAutoTMMDialog",
                       title: "Enable automatic torrent management",
                       data: {
                           hashes: hashes,
                           enable: enableAutoTMM
                       },
                       contentURL: "views/confirmAutoTMM.html"
                   });
               }
               else {
                   new Request({
                       url: "api/v2/torrents/setAutoManagement",
                       method: "post",
                       data: {
                           hashes: hashes.join("|"),
                           enable: enableAutoTMM
                       },
                       onSuccess: () => {
                           updateMainData();
                       },
                       onFailure: () => {
                           alert("Unable to set Auto Torrent Management for the selected torrents.");
                       }
                   }).send();
               }
           }
       };
   
       recheckFN = function() {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length > 0) {
               if (window.qBittorrent.Cache.preferences.get().confirm_torrent_recheck) {
                   new MochaUI.Modal({
                       ...window.qBittorrent.Dialog.baseModalOptions,
                       id: "confirmRecheckDialog",
                       title: "Recheck confirmation",
                       data: { hashes: hashes },
                       contentURL: "views/confirmRecheck.html"
                   });
               }
               else {
                   new Request({
                       url: "api/v2/torrents/recheck",
                       method: "post",
                       data: {
                           "hashes": hashes.join("|"),
                       },
                       onSuccess: function() {
                           updateMainData();
                       },
                       onFailure: function() {
                           alert("Unable to recheck torrents.");
                       }
                   }).send();
               }
           }
       };
   
       reannounceFN = function() {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length) {
               new Request({
                   url: "api/v2/torrents/reannounce",
                   method: "post",
                   data: {
                       hashes: hashes.join("|"),
                   }
               }).send();
               updateMainData();
           }
       };
   
       setLocationFN = function() {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length) {
               const hash = hashes[0];
               const row = torrentsTable.getRow(hash);
   
               new MochaUI.Window({
                   id: "setLocationPage",
                   icon: "images/qbittorrent-tray.svg",
                   title: "Set location",
                   loadMethod: "iframe",
                   contentURL: new URI("setlocation.html").setData("hashes", hashes.join("|")).setData("path", encodeURIComponent(row.full_data.save_path)).toString(),
                   scrollbars: false,
                   resizable: true,
                   maximizable: false,
                   paddingVertical: 0,
                   paddingHorizontal: 0,
                   width: 400,
                   height: 130
               });
           }
       };
   
       renameFN = function() {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length === 1) {
               const hash = hashes[0];
               const row = torrentsTable.getRow(hash);
               if (row) {
                   new MochaUI.Window({
                       id: "renamePage",
                       icon: "images/qbittorrent-tray.svg",
                       title: "Rename",
                       loadMethod: "iframe",
                       contentURL: new URI("rename.html").setData("hash", hash).setData("name", row.full_data.name).toString(),
                       scrollbars: false,
                       resizable: true,
                       maximizable: false,
                       paddingVertical: 0,
                       paddingHorizontal: 0,
                       width: 400,
                       height: 100
                   });
               }
           }
       };
   
       renameFilesFN = function() {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length === 1) {
               const hash = hashes[0];
               const row = torrentsTable.getRow(hash);
               if (row) {
                   new MochaUI.Window({
                       id: "multiRenamePage",
                       icon: "images/qbittorrent-tray.svg",
                       title: "Renaming",
                       data: { hash: hash, selectedRows: [] },
                       loadMethod: "xhr",
                       contentURL: "rename_files.html",
                       scrollbars: false,
                       resizable: true,
                       maximizable: false,
                       paddingVertical: 0,
                       paddingHorizontal: 0,
                       width: 800,
                       height: 420,
                       resizeLimit: { "x": [800], "y": [420] }
                   });
               }
           }
       };
   
       startVisibleTorrentsFN = function() {
           const hashes = torrentsTable.getFilteredTorrentsHashes(selectedStatus, selectedCategory, selectedTag, selectedTracker);
           if (hashes.length > 0) {
               new Request({
                   url: "api/v2/torrents/start",
                   method: "post",
                   data: {
                       hashes: hashes.join("|")
                   },
                   onSuccess: () => {
                       updateMainData();
                       updatePropertiesPanel();
                   },
                   onFailure: () => {
                       alert("Unable to start torrents.");
                   }
               }).send();
           }
       };
   
       stopVisibleTorrentsFN = function() {
           const hashes = torrentsTable.getFilteredTorrentsHashes(selectedStatus, selectedCategory, selectedTag, selectedTracker);
           if (hashes.length > 0) {
               new Request({
                   url: "api/v2/torrents/stop",
                   method: "post",
                   data: {
                       hashes: hashes.join("|")
                   },
                   onSuccess: () => {
                       updateMainData();
                       updatePropertiesPanel();
                   },
                   onFailure: () => {
                       alert("Unable to stop torrents.");
                   }
               }).send();
           }
       };
   
       deleteVisibleTorrentsFN = function() {
           const hashes = torrentsTable.getFilteredTorrentsHashes(selectedStatus, selectedCategory, selectedTag, selectedTracker);
           if (hashes.length > 0) {
            //   if (window.qBittorrent.Cache.preferences.get().confirm_torrent_deletion) {
                   new MochaUI.Modal({
                       ...window.qBittorrent.Dialog.baseModalOptions,
                       id: "confirmDeletionPage",
                       title: "Remove torrent(s)",
                       data: {
                           hashes: hashes,
                           isDeletingVisibleTorrents: true
                       },
                       contentURL: "views/confirmdeletion.html",
                       onContentLoaded: function(w) {
                           MochaUI.resizeWindow(w, { centered: true });
                           MochaUI.centerWindow(w);
                       }
                   });
            //    }
            //    else {
            //        new Request({
            //            url: "api/v2/torrents/delete",
            //            method: "post",
            //            data: {
            //                hashes: hashes.join("|"),
            //                deleteFiles: false,
            //            },
            //            onSuccess: () => {
            //                torrentsTable.deselectAll();
            //                updateMainData();
            //                updatePropertiesPanel();
            //            },
            //            onFailure: () => {
            //                alert("Unable to delete torrents.");
            //            }
            //        }).send();
            //    }
           }
       };
   
       torrentNewCategoryFN = function() {
           const action = "set";
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length) {
               new MochaUI.Window({
                   id: "newCategoryPage",
                   icon: "images/qbittorrent-tray.svg",
                   title: "New Category",
                   loadMethod: "iframe",
                   contentURL: new URI("newcategory.html").setData("action", action).setData("hashes", hashes.join("|")).toString(),
                   scrollbars: false,
                   resizable: true,
                   maximizable: false,
                   paddingVertical: 0,
                   paddingHorizontal: 0,
                   width: 400,
                   height: 150
               });
           }
       };
   
       torrentSetCategoryFN = function(categoryHash) {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length <= 0)
               return;
   
           const categoryName = category_list.has(categoryHash)
               ? category_list.get(categoryHash).name
               : "";
           new Request({
               url: "api/v2/torrents/setCategory",
               method: "post",
               data: {
                   hashes: hashes.join("|"),
                   category: categoryName
               },
               onSuccess: function() {
                   updateMainData();
               }
           }).send();
       };
   
       createCategoryFN = function() {
           const action = "create";
           new MochaUI.Window({
               id: "newCategoryPage",
               icon: "images/qbittorrent-tray.svg",
               title: "New Category",
               loadMethod: "iframe",
               contentURL: new URI("newcategory.html").setData("action", action).toString(),
               scrollbars: false,
               resizable: true,
               maximizable: false,
               paddingVertical: 0,
               paddingHorizontal: 0,
               width: 400,
               height: 150
           });
       };
   
       createSubcategoryFN = function(categoryHash) {
           const action = "createSubcategory";
           const categoryName = category_list.get(categoryHash).name + "/";
           new MochaUI.Window({
               id: "newSubcategoryPage",
               icon: "images/qbittorrent-tray.svg",
               title: "New Category",
               loadMethod: "iframe",
               contentURL: new URI("newcategory.html").setData("action", action).setData("categoryName", categoryName).toString(),
               scrollbars: false,
               resizable: true,
               maximizable: false,
               paddingVertical: 0,
               paddingHorizontal: 0,
               width: 400,
               height: 150
           });
       };
   
       editCategoryFN = function(categoryHash) {
           const action = "edit";
           const category = category_list.get(categoryHash);
           new MochaUI.Window({
               id: "editCategoryPage",
               icon: "images/qbittorrent-tray.svg",
               title: "Edit Category",
               loadMethod: "iframe",
               contentURL: new URI("newcategory.html").setData("action", action).setData("categoryName", category.name).setData("savePath", category.savePath).toString(),
               scrollbars: false,
               resizable: true,
               maximizable: false,
               paddingVertical: 0,
               paddingHorizontal: 0,
               width: 400,
               height: 150
           });
       };
   
       removeCategoryFN = function(categoryHash) {
           const categoryName = category_list.get(categoryHash).name;
           new Request({
               url: "api/v2/torrents/removeCategories",
               method: "post",
               data: {
                   categories: categoryName
               },
               onSuccess: function() {
                   setCategoryFilter(CATEGORIES_ALL);
                   updateMainData();
               }
           }).send();
       };
   
       deleteUnusedCategoriesFN = function() {
           const categories = [];
           category_list.forEach((category, hash) => {
               if (torrentsTable.getFilteredTorrentsNumber("all", hash, TAGS_ALL, TRACKERS_ALL) === 0)
                   categories.push(category.name);
           });
   
           new Request({
               url: "api/v2/torrents/removeCategories",
               method: "post",
               data: {
                   categories: categories.join("\n")
               },
               onSuccess: function() {
                   setCategoryFilter(CATEGORIES_ALL);
                   updateMainData();
               }
           }).send();
       };
   
       torrentAddTagsFN = function() {
           const action = "set";
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length) {
               new MochaUI.Window({
                   id: "newTagPage",
                   icon: "images/qbittorrent-tray.svg",
                   title: "Add tags",
                   loadMethod: "iframe",
                   contentURL: new URI("newtag.html").setData("action", action).setData("hashes", hashes.join("|")).toString(),
                   scrollbars: false,
                   resizable: true,
                   maximizable: false,
                   paddingVertical: 0,
                   paddingHorizontal: 0,
                   width: 250,
                   height: 100
               });
           }
       };
   
       torrentSetTagsFN = function(tagHash, isSet) {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length <= 0)
               return;
   
           const tagName = tagList.has(tagHash) ? tagList.get(tagHash).name : "";
           new Request({
               url: (isSet ? "api/v2/torrents/addTags" : "api/v2/torrents/removeTags"),
               method: "post",
               data: {
                   hashes: hashes.join("|"),
                   tags: tagName,
               }
           }).send();
       };
   
       torrentRemoveAllTagsFN = function() {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length) {
               new Request({
                   url: ("api/v2/torrents/removeTags"),
                   method: "post",
                   data: {
                       hashes: hashes.join("|"),
                   }
               }).send();
           }
       };
   
       createTagFN = function() {
           const action = "create";
           new MochaUI.Window({
               id: "newTagPage",
               icon: "images/qbittorrent-tray.svg",
               title: "New Tag",
               loadMethod: "iframe",
               contentURL: new URI("newtag.html").setData("action", action).toString(),
               scrollbars: false,
               resizable: true,
               maximizable: false,
               paddingVertical: 0,
               paddingHorizontal: 0,
               width: 250,
               height: 100
           });
           updateMainData();
       };
   
       removeTagFN = function(tagHash) {
           const tagName = tagList.get(tagHash).name;
           new Request({
               url: "api/v2/torrents/deleteTags",
               method: "post",
               data: {
                   tags: tagName
               }
           }).send();
           setTagFilter(TAGS_ALL);
       };
   
       deleteUnusedTagsFN = function() {
           const tags = [];
           tagList.forEach((tag, hash) => {
               if (torrentsTable.getFilteredTorrentsNumber("all", CATEGORIES_ALL, hash, TRACKERS_ALL) === 0)
                   tags.push(tag.name);
           });
           new Request({
               url: "api/v2/torrents/deleteTags",
               method: "post",
               data: {
                   tags: tags.join(",")
               }
           }).send();
           setTagFilter(TAGS_ALL);
       };

       startTorrentsByTagFN = function(tagHash) {
        const hashes = torrentsTable.getFilteredTorrentsHashes("all", CATEGORIES_ALL, tagHash, TRACKERS_ALL);
        if (hashes.length) {
            new Request({
                url: "api/v2/torrents/start",
                method: "post",
                data: {
                    hashes: hashes.join("|")
                }
            }).send();
            updateMainData();
        }
    };

    stopTorrentsByTagFN = function(tagHash) {
        const hashes = torrentsTable.getFilteredTorrentsHashes("all", CATEGORIES_ALL, tagHash, TRACKERS_ALL);
        if (hashes.length) {
            new Request({
                url: "api/v2/torrents/stop",
                method: "post",
                data: {
                    hashes: hashes.join("|")
                }
            }).send();
            updateMainData();
        }
    };

    deleteTorrentsByTagFN = function(tagHash) {
        const hashes = torrentsTable.getFilteredTorrentsHashes("all", CATEGORIES_ALL, tagHash, TRACKERS_ALL);
        if (hashes.length > 0) {
            if (window.qBittorrent.Cache.preferences.get().confirm_torrent_deletion) {
                new MochaUI.Modal({
                    ...window.qBittorrent.Dialog.baseModalOptions,
                    id: "confirmDeletionPage",
                    title: "QBT_TR(Remove torrent(s))QBT_TR[CONTEXT=confirmDeletionDlg]",
                    data: { hashes: hashes },
                    contentURL: "views/confirmdeletion.html",
                    onContentLoaded: function(w) {
                        MochaUI.resizeWindow(w, { centered: true });
                        MochaUI.centerWindow(w);
                    },
                    onCloseComplete: function() {
                        // make sure overlay is properly hidden upon modal closing
                        document.getElementById("modalOverlay").style.display = "none";
                    }
                });
            }
            else {
                new Request({
                    url: "api/v2/torrents/delete",
                    method: "post",
                    data: {
                        hashes: hashes.join("|"),
                        deleteFiles: false,
                    },
                    onSuccess: function() {
                        torrentsTable.deselectAll();
                        updateMainData();
                    },
                    onFailure: function() {
                        alert("QBT_TR(Unable to delete torrents.)QBT_TR[CONTEXT=HttpServer]");
                    }
                }).send();
            }
        }
    };

    startTorrentsByTrackerFN = function(trackerHash) {
        const trackerHashInt = Number.parseInt(trackerHash, 10);
        let hashes = [];
        switch (trackerHashInt) {
            case TRACKERS_ALL:
                hashes = torrentsTable.getFilteredTorrentsHashes("all", CATEGORIES_ALL, TAGS_ALL, TRACKERS_ALL);
                break;
            case TRACKERS_TRACKERLESS:
                hashes = torrentsTable.getFilteredTorrentsHashes("all", CATEGORIES_ALL, TAGS_ALL, TRACKERS_TRACKERLESS);
                break;
            default: {
                const uniqueTorrents = new Set();
                for (const torrents of trackerList.get(trackerHashInt).trackerTorrentMap.values()) {
                    for (const torrent of torrents)
                        uniqueTorrents.add(torrent);
                }
                hashes = [...uniqueTorrents];
                break;
            }
        }

        if (hashes.length > 0) {
            new Request({
                url: "api/v2/torrents/start",
                method: "post",
                data: {
                    hashes: hashes.join("|")
                }
            }).send();
            updateMainData();
        }
    };

    stopTorrentsByTrackerFN = function(trackerHash) {
        const trackerHashInt = Number.parseInt(trackerHash, 10);
        let hashes = [];
        switch (trackerHashInt) {
            case TRACKERS_ALL:
                hashes = torrentsTable.getFilteredTorrentsHashes("all", CATEGORIES_ALL, TAGS_ALL, TRACKERS_ALL);
                break;
            case TRACKERS_TRACKERLESS:
                hashes = torrentsTable.getFilteredTorrentsHashes("all", CATEGORIES_ALL, TAGS_ALL, TRACKERS_TRACKERLESS);
                break;
            default: {
                const uniqueTorrents = new Set();
                for (const torrents of trackerList.get(trackerHashInt).trackerTorrentMap.values()) {
                    for (const torrent of torrents)
                        uniqueTorrents.add(torrent);
                }
                hashes = [...uniqueTorrents];
                break;
            }
        }

        if (hashes.length) {
            new Request({
                url: "api/v2/torrents/stop",
                method: "post",
                data: {
                    hashes: hashes.join("|")
                }
            }).send();
            updateMainData();
        }
    };

    deleteTorrentsByTrackerFN = function(trackerHash) {
        const trackerHashInt = Number.parseInt(trackerHash, 10);
        let hashes = [];
        switch (trackerHashInt) {
            case TRACKERS_ALL:
                hashes = torrentsTable.getFilteredTorrentsHashes("all", CATEGORIES_ALL, TAGS_ALL, TRACKERS_ALL);
                break;
            case TRACKERS_TRACKERLESS:
                hashes = torrentsTable.getFilteredTorrentsHashes("all", CATEGORIES_ALL, TAGS_ALL, TRACKERS_TRACKERLESS);
                break;
            default: {
                const uniqueTorrents = new Set();
                for (const torrents of trackerList.get(trackerHashInt).trackerTorrentMap.values()) {
                    for (const torrent of torrents)
                        uniqueTorrents.add(torrent);
                }
                hashes = [...uniqueTorrents];
                break;
            }
        }

        if (hashes.length > 0) {
            if (window.qBittorrent.Cache.preferences.get().confirm_torrent_deletion) {
                new MochaUI.Modal({
                    ...window.qBittorrent.Dialog.baseModalOptions,
                    id: "confirmDeletionPage",
                    title: "QBT_TR(Remove torrent(s))QBT_TR[CONTEXT=confirmDeletionDlg]",
                    data: {
                        hashes: hashes,
                        filterList: "tracker"
                    },
                    contentURL: "views/confirmdeletion.html",
                    onContentLoaded: function(w) {
                        MochaUI.resizeWindow(w, { centered: true });
                        MochaUI.centerWindow(w);
                    },
                    onCloseComplete: function() {
                        // make sure overlay is properly hidden upon modal closing
                        document.getElementById("modalOverlay").style.display = "none";
                    }
                });
            }
            else {
                new Request({
                    url: "api/v2/torrents/delete",
                    method: "post",
                    data: {
                        hashes: hashes.join("|"),
                        deleteFiles: false,
                    },
                    onSuccess: function() {
                        torrentsTable.deselectAll();
                        setTrackerFilter(TRACKERS_ALL);
                        updateMainData();
                    },
                    onFailure: function() {
                        alert("QBT_TR(Unable to delete torrents.)QBT_TR[CONTEXT=HttpServer]");
                    },
                }).send();
            }
        }
    };
   
       deleteTrackerFN = function(trackerHash) {
           const trackerHashInt = Number.parseInt(trackerHash, 10);
           if ((trackerHashInt === TRACKERS_ALL) || (trackerHashInt === TRACKERS_TRACKERLESS))
               return;
   
           const tracker = trackerList.get(trackerHashInt);
           const host = tracker.host;
           const urls = [...tracker.trackerTorrentMap.keys()];
   
           new MochaUI.Window({
               id: "confirmDeletionPage",
               title: "Remove tracker",
               loadMethod: "iframe",
               contentURL: new URI("confirmtrackerdeletion.html").setData("host", host).setData("urls", urls.map(encodeURIComponent).join("|")).toString(),
               scrollbars: false,
               resizable: true,
               maximizable: false,
               padding: 10,
               width: 424,
               height: 100,
               onCloseComplete: function() {
                   updateMainData();
                   setTrackerFilter(TRACKERS_ALL);
               }
           });
       };
   
       copyNameFN = function() {
           const selectedRows = torrentsTable.selectedRowsIds();
           const names = [];
           if (selectedRows.length > 0) {
               const rows = torrentsTable.getFilteredAndSortedRows();
               for (let i = 0; i < selectedRows.length; ++i) {
                   const hash = selectedRows[i];
                   names.push(rows[hash].full_data.name);
               }
           }
           return names.join("\n");
       };
   
       copyInfohashFN = function(policy) {
           const selectedRows = torrentsTable.selectedRowsIds();
           const infohashes = [];
           if (selectedRows.length > 0) {
               const rows = torrentsTable.getFilteredAndSortedRows();
               switch (policy) {
                   case 1:
                       for (const id of selectedRows) {
                           const infohash = rows[id].full_data.infohash_v1;
                           if (infohash !== "")
                               infohashes.push(infohash);
                       }
                       break;
                   case 2:
                       for (const id of selectedRows) {
                           const infohash = rows[id].full_data.infohash_v2;
                           if (infohash !== "")
                               infohashes.push(infohash);
                       }
                       break;
               }
           }
           return infohashes.join("\n");
       };
   
       copyMagnetLinkFN = function() {
           const selectedRows = torrentsTable.selectedRowsIds();
           const magnets = [];
           if (selectedRows.length > 0) {
               const rows = torrentsTable.getFilteredAndSortedRows();
               for (let i = 0; i < selectedRows.length; ++i) {
                   const hash = selectedRows[i];
                   magnets.push(rows[hash].full_data.magnet_uri);
               }
           }
           return magnets.join("\n");
       };
   
       copyIdFN = function() {
           return torrentsTable.selectedRowsIds().join("\n");
       };
   
       copyCommentFN = function() {
           const selectedRows = torrentsTable.selectedRowsIds();
           const comments = [];
           if (selectedRows.length > 0) {
               const rows = torrentsTable.getFilteredAndSortedRows();
               for (let i = 0; i < selectedRows.length; ++i) {
                   const hash = selectedRows[i];
                   const comment = rows[hash].full_data.comment;
                   if (comment && (comment !== ""))
                       comments.push(comment);
               }
           }
           return comments.join("\n---------\n");
       };
   
       exportTorrentFN = async function() {
           const hashes = torrentsTable.selectedRowsIds();
           for (const hash of hashes) {
               const row = torrentsTable.getRow(hash);
               if (!row)
                   continue;
   
               const name = row.full_data.name;
               const url = new URI("api/v2/torrents/export");
               url.setData("hash", hash);
   
               // download response to file
               const element = document.createElement("a");
               element.href = url;
               element.download = (name + ".torrent");
               document.body.appendChild(element);
               element.click();
               document.body.removeChild(element);
   
               // https://stackoverflow.com/questions/53560991/automatic-file-downloads-limited-to-10-files-on-chrome-browser
               await window.qBittorrent.Misc.sleep(200);
           }
       };
   
       addClickEvent("stopAll", (e) => {
           e.preventDefault();
           e.stopPropagation();
   
           if (confirm("Would you like to stop all torrents?")) {
               new Request({
                   url: "api/v2/torrents/stop",
                   method: "post",
                   data: {
                       hashes: "all"
                   }
               }).send();
               updateMainData();
           }
       });
   
       addClickEvent("startAll", (e) => {
           e.preventDefault();
           e.stopPropagation();
   
           if (confirm("Would you like to start all torrents?")) {
               new Request({
                   url: "api/v2/torrents/start",
                   method: "post",
                   data: {
                       hashes: "all"
                   }
               }).send();
               updateMainData();
           }
       });
   
       ["stop", "start", "recheck"].each((item) => {
           addClickEvent(item, (e) => {
               e.preventDefault();
               e.stopPropagation();
   
               const hashes = torrentsTable.selectedRowsIds();
               if (hashes.length) {
                   hashes.each((hash, index) => {
                       new Request({
                           url: "api/v2/torrents/" + item,
                           method: "post",
                           data: {
                               hashes: hash
                           }
                       }).send();
                   });
                   updateMainData();
               }
           });
       });
   
       ["decreasePrio", "increasePrio", "topPrio", "bottomPrio"].each((item) => {
           addClickEvent(item, (e) => {
               e.preventDefault();
               e.stopPropagation();
               setQueuePositionFN(item);
           });
       });
   
       setQueuePositionFN = function(cmd) {
           const hashes = torrentsTable.selectedRowsIds();
           if (hashes.length) {
               new Request({
                   url: "api/v2/torrents/" + cmd,
                   method: "post",
                   data: {
                       hashes: hashes.join("|")
                   }
               }).send();
               updateMainData();
           }
       };
   
       addClickEvent("about", (e) => {
           e.preventDefault();
           e.stopPropagation();
   
           const id = "aboutpage";
           new MochaUI.Window({
               id: id,
               icon: "images/qbittorrent-tray.svg",
               title: "About qBittorrent",
               loadMethod: "xhr",
               contentURL: new URI("views/about.html").toString(),
               require: {
                   css: ["css/Tabs.css"]
               },
               toolbar: true,
               toolbarURL: "views/aboutToolbar.html",
               padding: 10,
               width: loadWindowWidth(id, 570),
               height: loadWindowHeight(id, 360),
               onResize: window.qBittorrent.Misc.createDebounceHandler(500, (e) => {
                   saveWindowSize(id);
               })
           });
       });
   
       addClickEvent("logout", (e) => {
           e.preventDefault();
           e.stopPropagation();
   
           new Request({
               url: "api/v2/auth/logout",
               method: "post",
               onSuccess: function() {
                   window.location.reload(true);
               }
           }).send();
       });
   
       addClickEvent("shutdown", (e) => {
           e.preventDefault();
           e.stopPropagation();
   
           if (confirm("Are you sure you want to quit qBittorrent?")) {
               new Request({
                   url: "api/v2/app/shutdown",
                   method: "post",
                   onSuccess: function() {
                       const shutdownMessage = "%1 has been shutdown".replace("%1", window.qBittorrent.Client.mainTitle());
                       document.write(`<!doctype html><html lang="${LANG}"><head> <meta charset="UTF-8"> <meta name="color-scheme" content="light dark"> <title>${shutdownMessage}</title> <style>* {font-family: Arial, Helvetica, sans-serif;}</style></head><body> <h1 style="text-align: center;">${shutdownMessage}</h1></body></html>`);
                       document.close();
                       window.stop();
                       window.qBittorrent.Client.stop();
                   }
               }).send();
           }
       });
   
       // Deactivate menu header links
       $$("a.returnFalse").each((el) => {
           el.addEventListener("click", (e) => {
               e.preventDefault();
               e.stopPropagation();
           });
       });
   };
   