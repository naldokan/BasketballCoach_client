import React from 'react';
import cx from 'classnames';
import {
  ResponsiveContainer,
	AreaChart,
	ScatterChart,
	Area,
	Scatter,
  CartesianGrid,
  Tooltip,
	XAxis,
	YAxis,
	ZAxis,
} from 'recharts';
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
		>
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

export const GoalMap = ({ success, fail }) => (
	<ResponsiveContainer
		className={'chart-box'}
		height={500}
		width='100%'
	>
		<ScatterChart width={1000} height={1000}
			margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="x" range={[0, 1000]} />
			<YAxis dataKey="y" range={[0, 1000]} unit="kg" />
			<ZAxis dataKey="z" range={[0, 1]} />
			<Scatter name="A school" data={success} fill="#8884d8" />
			<Scatter name="B school" data={fail} fill="#82ca9d" />
		</ScatterChart>
	</ResponsiveContainer> 
)