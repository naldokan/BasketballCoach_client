import React, { Component } from 'react';
import cx from 'classnames';
import {
  ResponsiveContainer,
	AreaChart,
	ScatterChart,
	Area,
	Scatter,
	Cell,
  CartesianGrid,
  Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { accuracyColor, Round } from 'utils'
import playground from 'playground.png';
import './styles.scss'


export const LineChart = ({ data, dataKey, showXTick }) => (
	<ResponsiveContainer
		className={cx('line-chart-box', {'hide-x-tick': !showXTick})}
		height={200}
		width='100%'
	>
		<AreaChart
			width={400}
			height={150}
			data={data}
			margin={{ top: 0, bottom: 0, left: 0, right: 0}}>
			<defs>
				<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
					<stop offset="5%" stopColor="#ff7300" stopOpacity={0.6}/>
					<stop offset="95%" stopColor="#ff7300" stopOpacity={0}/>
				</linearGradient>
			</defs>
			<XAxis dataKey="name" />
			<YAxis/>
			<CartesianGrid strokeDasharray="3 3" />
			<Tooltip />
			<CartesianGrid stroke="#f5f5f5" />
			<Area dataKey={dataKey} stroke="#ff7300" fillOpacity={1} fill="url(#colorUv)" />
		</AreaChart>
	</ResponsiveContainer> 
)


export const GoalMap = ({ positions, active }) => {
	const data = positions.map(({ x, y }) => ({ x, y: 1000 - y, z: 4 }))
	const successColor = '#5be569'
	const failColor = '#d64a4a'
	const successActiveColor = successColor // '#cdf2d1'
	const failActiveColor = failColor // '#efb3b3'
	const strokeWidth = 15

	return (
		<div className='goal-map'>
			<ResponsiveContainer
				className='position-absolute'
				width='100%'
				margin={{ top: 0, bottom: 0, left: 0, right: 0}}>
				<ScatterChart width={500} height={500}>
					<XAxis dataKey="x" hide={true} domain={[0, 1000]} type='number' />
					<YAxis dataKey="y" hide={true} domain={[0, 1000]} type='number' />
					<Scatter name="Success" data={data} fill="#1ab229">
						{ positions.map((val, index) => val.success ? (
							<Cell
								key={index}
								fill={successColor}
								stroke={successActiveColor}
								strokeWidth={active === index ? strokeWidth : 5}
								className={cx({ 'active-position success-position': active === index })}
							/>
						) : (
							<Cell
								key={index}
								fill={failColor}
								stroke={failActiveColor}
								strokeWidth={active === index ? strokeWidth : 5}
								className={cx({ 'active-position fail-position': active === index })}
							/>
						)) }
					</Scatter>
				</ScatterChart>
			</ResponsiveContainer>
			<img className='w-100' src={playground} />
		</div>
	)
}

export const GoalColorMap = ({ positions }) => {
	const xsplit = 5
	const ysplit = 5
	const accuracy = Array(xsplit * ysplit).fill(0).map(() => ({ success: 0, total: 0 }))

	positions && positions.forEach(({ x, y, success }) => {
		const xi = Math.floor(Math.min(x, 999) * xsplit / 1000)
		const yi = Math.floor(Math.min(y, 999) * ysplit / 1000)
		const i = xsplit * yi + xi

		accuracy[i].total = accuracy[i].total + 1
		if (success) {
			accuracy[i].success = accuracy[i].success + 1
		}	
	})

	return (
		<div className='goal-color-map'>
			<div className='color-map'>
				{accuracy.map(({ success, total }, key) => (
					<div
						key={key}
						title={total && `${Round(success * 100 / total)}%`}
						style={{
							width: `${100 / xsplit}%`,
							height: `${Math.round(100 / ysplit)}%`,
							backgroundColor: total ? accuracyColor(success * 100 / total) : '#ffffff00'
						}}>
					</div>
				))}
			</div>
			<img className='w-100' src={playground} />
		</div>
	)
}
