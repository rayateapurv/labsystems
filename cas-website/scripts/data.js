const satdata = `
Latitude,Longitude,Launch Site,Launch Mass,Date of Launch,Users,Purpose,Name,Country,Capital
0.00,-1.00,Cape Canaveral,5400,2020-12-11,Military,Earth Observation,USA 311,USA,Washington D.C.
0.00,-94.39,Cape Canaveral,6169,2019-08-08,Military,Communications,USA 292,USA,Washington D.C.
0.00,3.00,Cape Canaveral,6169,2020-03-26,Military,Communications,USA 298,USA,Washington D.C.
0.00,17.00,Cape Canaveral,6500,2019-08-06,Military,Communications,Amos 17,Israel,Jerusalem
0.00,115.90,Cape Canaveral,5500,2020-07-20,Military,Communications,ANASIS-II,South Korea,Seoul
0.00,134.00,Xichang Satellite Launch Center,5550,2020-07-09,Commercial,Communications,Apstar 6D,China,Beijing
0.00,30.50,Cape Canaveral,6465,2019-04-11,Commercial,Communications,Arabsat 6A,Multinational,Riyadh
0.00,-101.00,Guiana Space Center,6350,2019-06-20,Commercial,Communications,AT&T T16,USA,Washington D.C.
0.00,110.03,Xichang Satellite Launch Center,800,2019-04-20,Military,Navigation/Global Positioning,Beidou DW 44,China,Beijing
0.00,144.48,Xichang Satellite Launch Center,800,2019-05-17,Military,Navigation/Global Positioning,Beidou DW 45,China,Beijing
0.00,105.99,Xichang Satellite Launch Center,800,2019-06-24,Military,Navigation/Global Positioning,Beidou DW 46,China,Beijing
0.00,106.72,Xichang Satellite Launch Center,4200,2019-11-05,Military,Navigation/Global Positioning,Beidou 3 IGSO-3,China,Beijing
0.00,111.00,Xichang Satellite Launch Center,800,2020-06-23,Military,Navigation/Global Positioning,Beidou DW 55,China,Beijing
0.00,79.00,Xichang Satellite Launch Center,2200,2020-03-09,Military,Navigation/Global Positioning,Beidou G3,China,Beijing
0.00,55.00,Baikonur Cosmodrome,3000,2019-08-05,Military,Communications,Cosmos 2539,Russia,Moscow
0.00,108.00,Guiana Space Center,3520,2020-08-15,Commercial,Communications,BSAT-4B,Japan,Tokyo
0.00,78.00,Satish Dhawan Space Centre,1500,2020-12-17,Government,Communications,CMS-1,India,New Delhi
0.00,33.00,Guiana Space Center,3186,2019-08-06,Commercial,Communications,EDRS-C,EU,Paris
0.00,165.80,Baikonur Cosmodrome,2094,2019-12-24,Government,Earth Observation,Electro-L3,Russia,Moscow
0.00,-5.00,Baikonur Cosmodrome,2864,2019-10-09,Commercial,Communications,Eutelsat 5 West B,Multinational,Paris
0.00,7.00,Guiana Space Center,3400,2019-06-20,Commercial,Communications,Eutelsat 7C,Multinational,Paris
0.00,14.00,Guiana Space Center,3618,2020-01-16,Commercial,Communications,Eutelsat Konnect,Multinational,Paris
0.00,96.50,Baikonur Cosmodrome,2150,2020-07-30,Commercial,Communications,Express-103,Russia,Moscow
0.00,80.00,Baikonur Cosmodrome,2150,2020-07-30,Commercial,Communications,Express-80,Russia,Moscow
0.00,-125.00,Guiana Space Center,3298,2020-08-15,Commercial,Communications,Galaxy-30,USA,Washington D.C.
0.00,118.00,Xichang Satellite Launch Center,1000,2020-10-11,Government,Earth Observation,Gaofen 13,China,Beijing
0.00,128.00,Guiana Space Center,3379,2020-02-18,Government,Earth Observation,GEO-Kompsat-2B,South Korea,Seoul
0.00,83.00,Guiana Space Center,3357,2020-01-16,Government,Communications,GSAT-30,India,New Delhi
0.00,48.00,Guiana Space Center,2536,2019-02-05,Government,Communications,GSAT-31,India,New Delhi
0.00,39.00,Guiana Space Center,6495,2019-02-05,Commercial,Communications,Hellas-Sat 4,Greece,Athens
0.00,11.00,Guiana Space Center,4007,2019-11-26,Commercial,Communications,INMARSAT 5 F5,United Kingdom,London
0.00,62.00,Guiana Space Center,6600,2019-08-06,Commercial,Communications,Intelsat 39,USA,Washington D.C.
0.00,136.00,Guiana Space Center,5857,2020-02-18,Commercial,Communications,JCSat 17,Japan,Tokyo
0.00,150.00,Cape Canaveral,6956,2019-12-17,Commercial,Communications,JCSat18/Kacific 1,Japan/Singapore,Tokyo
0.00,91.00,Tanegashima Space Center,4000,2020-11-29,Government,Communications,LUCAS,Japan,Tokyo
0.00,-27.50,Baikonur Cosmodrome,2875,2019-10-09,Commercial,Mission Extension Technology,MEV-1,USA,Washington D.C.
0.00,358.00,Guiana Space Center,2875,2020-08-15,Commercial,Mission Extension Technology,MEV-2,USA,Washington D.C.
0.00,146.00,Cape Canaveral,4100,2019-02-21,Commercial,Communications,Nusantara Satu (PSN-6),Indonesia,Jakarta
0.00,125.00,Wenchang Satellite Launch Center,7600,2019-12-27,Government,Technology Development,Shijian 20,China,Beijing
0.00,5.00,Wenchang Satellite Launch Center,5000,2021-03-12,Government,Technology Development,Shiyan 9,China,Beijing
0.00,-85.15,Cape Canaveral,7000,2020-12-13,Commercial,Communications,Sirius XM-7,USA,Washington D.C.
0.00,0.00,Xichang Satellite Launch Center,5200,2019-03-31,Government,Communications,TianLian 2.01,China,Beijing
0.00,122.00,Xichang Satellite Launch Center,4600,2020-11-12,Government,Communications,Tiantong-1-02,China,Beijing
0.00,81.43,Xichang Satellite Launch Center,4600,2021-01-19,Government,Communications,Tiantong-1-03,China,Beijing
0.00,35.50,Guiana Space Center,5600,2019-11-26,Military,Communications,TIBA-1,Egypt,Cairo
0.00,83.53,Xichang Satellite Launch Center,4600,2019-10-18,Government,Technology Development,TJS-4,China,Beijing
0.00,178.00,Xichang Satellite Launch Center,2700,2020-01-07,Government,Communications,TJS-5,China,Beijing
0.00,179.00,Xichang Satellite Launch Center,2700,2021-02-04,Government,Communications,TJS-6,China,Beijing
0.00,31.50,Cape Canaveral,3500,2021-01-08,Commercial,Communications,Turksat 5A,Turkey,Ankara
0.00,-52.00,Cape Canaveral,5990,2019-03-16,Military,Communications,USA 291,USA,Washington D.C.
0.00,49.00,Baikonur Cosmodrome,5400,2019-05-30,Commercial,Communications,Yamal-601,Russia,Moscow
0.00,130.00,Xichang Satellite Launch Center,5200,2019-01-10,Government,Communications,Zhongxing 2D,China,Beijing
0.00,133.00,Xichang Satellite Launch Center,4600,2019-03-11,Government,Communications,Zhongxing 6C,China,Beijing
`;

const sitedata = `
Launch Site,Latitude,Longitude,Country
Cape Canaveral,28.4,-80.6,USA
Guiana Space Center,5.23,-52.77,France
Baikonur Cosmodrome,45.91,63.4,Russia
Satish Dhawan Space Centre,13.72, 80.16,India
Wenchang Satellite Launch Center,40.96,100.28,China
Xichang Satellite Launch Center,28.24,102.02,China
Tanegashima Space Center,30.37,130.95,Japan
`;

const citydata = `
Capital,Latitude,Longitude,Country
Washington D.C.,38.9,-77.04,USA
Jerusalem,31.78,35.23,Israel
Seoul,37.57,126.98,South Korea
Beijing,39.91,116.39,China
Riyadh,24.64,46.72,Saudi Arabia
Moscow,55.75,37.62,Russia
Tokyo,35.68,139.76,Japan
New Delhi,28.61, 77.20,India
Paris,48.86,2.35,France
Athens,37.98,23.73,Greece
London,51.51,-0.13,UK
Jakarta,-6.18,106.83,Indonesia
Cairo,30.04,31.24,Egypt
Ankara,39.92,32.85,Turkey
`;


