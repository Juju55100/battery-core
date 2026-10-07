# Battery Core Card

Custom Lovelace card for Home Assistant.

A standalone futuristic battery visualization inspired by a sci-fi energy core:
- animated circular energy ring
- animated battery/liquid level
- charge/discharge animation
- SOC 0–100 %
- battery power
- remaining charge time
- optional voltage, temperature and current
- optional solar / house flow
- no dependency on button-card or power-flow-card
- CSS is embedded in the JavaScript file

## Installation with HACS

This repository is intended to be added to HACS as a custom repository.

1. Copy the repository to GitHub.
2. In HACS → Frontend → ⋮ → Custom repositories.
3. Add the GitHub repository URL.
4. Select category **Dashboard**.
5. Install **Battery Core Card**.
6. Add the resource automatically through HACS, or add `/hacsfiles/battery-core-card/battery-core-card.js` as a JavaScript module if requested.
7. Restart/refresh Home Assistant.

## Minimal configuration

```yaml
type: custom:battery-core-card
battery_soc: sensor.onduleur_soc_batterie_1
battery_power: sensor.onduleur_puissance_batterie_1
time_remaining: sensor.temps_de_charge_restant_batterie
capacity: 29
title: BATTERIE
model: HYPO 4
```

## Optional entities

```yaml
voltage: sensor.xxx
temperature: sensor.xxx
current: sensor.xxx
solar_power: sensor.xxx
house_power: sensor.xxx
grid_power: sensor.xxx
```

The card treats positive battery power as charging and negative power as discharging.
