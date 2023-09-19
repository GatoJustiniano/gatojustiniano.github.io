<?php 

$dt = Carbon::create(2012, 1, 31, 15, 32, 45);
echo $dt->startOfMinute();                         // 2012-01-31 15:32:00

$dt = Carbon::create(2012, 1, 31, 15, 32, 45);
echo $dt->endOfMinute();                           // 2012-01-31 15:32:59

$dt = Carbon::create(2012, 1, 31, 15, 32, 45);
echo $dt->startOfHour();                           // 2012-01-31 15:00:00

$dt = Carbon::create(2012, 1, 31, 15, 32, 45);
echo $dt->endOfHour();                             // 2012-01-31 15:59:59

$dt = Carbon::create(2012, 1, 31, 15, 32, 45);
echo Carbon::getMidDayAt();                        // 12
echo $dt->midDay();                                // 2012-01-31 12:00:00
Carbon::setMidDayAt(13);
echo Carbon::getMidDayAt();                        // 13
echo $dt->midDay();                                // 2012-01-31 13:00:00
Carbon::setMidDayAt(12);

$dt = Carbon::create(2012, 1, 31, 12, 0, 0);
echo $dt->startOfDay();                            // 2012-01-31 00:00:00

$dt = Carbon::create(2012, 1, 31, 12, 0, 0);
echo $dt->endOfDay();                              // 2012-01-31 23:59:59

$dt = Carbon::create(2012, 1, 31, 12, 0, 0);
echo $dt->startOfMonth();                          // 2012-01-01 00:00:00

$dt = Carbon::create(2012, 1, 31, 12, 0, 0);
echo $dt->endOfMonth();                            // 2012-01-31 23:59:59

$dt = Carbon::create(2012, 1, 31, 12, 0, 0);
echo $dt->startOfYear();                           // 2012-01-01 00:00:00

$dt = Carbon::create(2012, 1, 31, 12, 0, 0);
echo $dt->endOfYear();                             // 2012-12-31 23:59:59
