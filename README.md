# qBittorrent Web UI theme - cjratliff.com [^1]
[^1]: Based on colorscheme from [cjratliff.com](https://cjratliff.com)

![Screenshot](qBittorrent-webui-theme-CJRatliff.com.jpg)

## Installation
First, you need to download a copy of the latest release (or clone / download this repository for the latest).

- [ ] Under Tools->Preferences->WebUI enable Use alternative WebUI.
- [ ] Choose a location that points to `/path/to/qbittorrent-webui-cjratliff.com`
- [ ] Restart qBittorrent or refresh your browser for changes to take effect.
- [ ] *Optional* Add content-security-policy headers under Tools->Preferences->WebUI > Add custom HTTP headers

`content-security-policy: default-src 'self'; style-src 'self' 'unsafe-inline' raw.githubusercontent.com use.fontawesome.com; img-src 'self' theme-park.dev raw.githubusercontent.com data:; script-src 'self' 'unsafe-inline'; object-src 'self'; form-action 'self'; frame-ancestors 'self'; font-src 'self' use.fontawesome.com;`

![optional-installation-step1](qBittorrent-webui-theme-CJRatliff.com-optional-installation-step1.jpg)


You can also change these settings via the config file. The relevant entries are:

```
WebUI\AlternativeUIEnabled=true
WebUI\RootFolder=/path/to/qbittorrent-webui-cjratliff.com
```

## Styling
### Colors
- ![#00d9ff](https://placehold.co/15x15/00d9ff/00d9ff.png) `Primary: #00d9ff`
- ![#202020](https://placehold.co/15x15/202020/202020.png) `Background: #202020`
- ![#242424](https://placehold.co/15x15/242424/242424.png) `Background-Alt: #242424`
- ![#4e4e4e](https://placehold.co/15x15/4e4e4e/4e4e4e.png) `Background-Alt2: #4e4e4e`
- ![#c2c2c2](https://placehold.co/15x15/c2c2c2/c2c2c2.png) `Text: #c2c2c2`
- ![#d3d3d3](https://placehold.co/15x15/d3d3d3/d3d3d3.png) `Text-Alt: #d3d3d3`
- ![#2F3437](https://placehold.co/15x15/2F3437/2F3437.png) `Line-Color: #2F3437`
- ![#ef596f](https://placehold.co/15x15/ef596f/ef596f.png) `Red: #ef596f`
- ![#be5046](https://placehold.co/15x15/be5046/be5046.png) `Orange: #be5046`
- ![#e5c07b](https://placehold.co/15x15/e5c07b/e5c07b.png) `Yellow: #e5c07b`
- ![#89ca78](https://placehold.co/15x15/89ca78/89ca78.png) `Green: #89ca78`
- ![#61afef](https://placehold.co/15x15/61afef/61afef.png) `Blue: #61afef`
- ![#d55fde](https://placehold.co/15x15/d55fde/d55fde.png) `Indigo: #d55fde`
- ![#ba5fde](https://placehold.co/15x15/ba5fde/ba5fde.png) `Violet: #ba5fde`

### Fonts
    Google Sans


## Other
*This is for qBittorent versions 5.x and higher, or qBittorent < 5.x, please use [v1.4.0](https://github.com/Carve/qbittorrent-webui-cjratliff.com/releases/tag/v1.4.0)*
