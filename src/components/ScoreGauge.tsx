import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface ScoreGaugeProps {
    score: number;
    label: string;
    color: string;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label, color }) => {
    const data = [
        { name: 'Score', value: score },
        { name: 'Remaining', value: 100 - score },
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="h-48 w-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={180}
                            endAngle={0}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            <Cell key="score" fill={color} cornerRadius={10} />
                            <Cell key="remaining" fill="#e2e8f0" cornerRadius={10} />
                            <Label
                                value={`${score}%`}
                                position="center"
                                className="text-3xl font-bold fill-slate-800"
                                dy={-10}
                            />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute bottom-10 left-0 right-0 text-center text-sm font-medium text-slate-500 uppercase tracking-wide">
                    {label}
                </div>
            </div>
        </div>
    );
};

export default ScoreGauge;
