import {range} from 'lodash-es';

const weekLabels = ['一', '二', '三', '四', '五', '六', '日'];

const weekOptions: any = range(7).map(d => {
  return {label: '星期' + weekLabels[d], value: d + 1 + ''};
});

const monthOptions: any = range(12).map(d => {
  return {label: d + 1 + '', value: d + 1 + ''};
});

const dateOptions: any = range(32).map(d => {
  return d === 0 ? {label: '最后一天', value: 'L'} : {label: d + '', value: d + ''};
});

const hourOptions: any = range(25).map(h => {
  return h === 0 ? {label: '每小时', value: '*'} : {label: h - 1 + '', value: h - 1 + ''};
});

const minuteOptions: any = range(60).map(m => {
  return {label: m + '', value: m + ''};
});

const cronOptions = [
  {label: '每月', value: 30},
  {label: '每周', value: 7},
  {label: '每日', value: 1},
  {label: '每几月', value: 90},
  {label: '每几日', value: 10},
  {label: '每几时', value: 24},
];

export const cronStringify = (d: any) => {
  let cron: any = [0, d._minute, d._hour];

  if (d._cycle === 1) {
    cron.push(...['*', '*', '?']);
  } else if (d._cycle === 7) {
    cron.push(...['?', '*', d._week.sort()]);
  } else if (d._cycle === 30) {
    cron.push(...[d._date.sort(), '*', '?']);
  } else if (d._cycle === 90) {
    cron.push(...[d._date.sort(), d._month + '/' + d._months, '?']);
  } else if (d._cycle === 10) {
    cron.push(...[d._day + '/' + d._days, '*', '?']);
  } else if (d._cycle === 24) {
    cron = [0, 0, d._our + '/' + d._ours, '*', '*', '?'];
  }

  return cron.join(' ');
};

export const cronParse = (d: any, key: any) => {
  const cron = d[key].split(' ');

  d._minute = cron[1];

  const hour = cron[2];
  const day = cron[3];
  const month = cron[4];
  const week = cron[5];

  if (hour.includes('/')) {
    const ours = hour.split('/');

    d._cycle = 24;
    d._our = ours[0];
    d._ours = ours[1];
    return;
  } else {
    d._hour = hour;
  }

  if (day === '*') {
    d._cycle = 1;
  } else if (day === '?') {
    d._cycle = 7;
    d._week = week.split(',');
  } else if (day.includes('/')) {
    const dates = day.split('/');

    d._cycle = 10;
    d._day = dates[0];
    d._days = dates[1];
  } else {
    d._cycle = 30;
    d._date = day.split(',');
  }

  if (month !== '*') {
    const months = month.split('/');

    d._cycle = 90;
    d._month = months[0];
    d._months = months[1];
  }
};

export const cronForms = [
  {
    type: 'select', label: '执行周期', key: '_cycle', value: 30, required: true,
    select: {options: cronOptions},
    show: true
  },
  {
    type: 'select', label: '开始月', key: '_month', value: '1', required: true,
    select: {options: monthOptions},
    span: 12, show: 'd=>d._cycle==90'
  },
  {
    type: 'select', label: '每几月', key: '_months', value: '3', required: true,
    select: {options: monthOptions},
    span: 12, show: 'd=>d._cycle==90'
  },
  {
    type: 'select', label: '开始日', key: '_day', value: '1', required: true,
    select: {options: dateOptions},
    span: 12, show: 'd=>d._cycle==10'
  },
  {
    type: 'select', label: '每几日', key: '_days', value: '3', required: true,
    select: {options: dateOptions},
    span: 12, show: 'd=>d._cycle==10'
  },
  {
    type: 'select', label: '开始时', key: '_our', value: '0', required: true,
    select: {options: hourOptions.slice(1)},
    span: 12, show: 'd=>d._cycle==24'
  },
  {
    type: 'select', label: '每几时', key: '_ours', value: '2', required: true,
    select: {options: hourOptions.slice(1)},
    span: 12, show: 'd=>d._cycle==24'
  },
  {
    type: 'select', label: '几号', key: '_date', value: ['1'], required: true,
    select: {options: dateOptions, multiple: true},
    show: 'd=>d._cycle==30||d._cycle==90'
  },
  {
    type: 'select', label: '星期几', key: '_week', value: ['1'], required: true,
    select: {options: weekOptions, multiple: true},
    show: 'd=>d._cycle==7'
  },
  {
    type: 'select', label: '小时', key: '_hour', value: '0', required: true,
    select: {options: hourOptions},
    span: 12, show: 'd=>d._cycle!=24'
  },
  {
    type: 'select', label: '分钟', key: '_minute', value: '0', required: true,
    select: {options: minuteOptions},
    span: 12, show: 'd=>d._cycle!=24'
  }
];
