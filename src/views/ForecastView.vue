<template>
    <section class="forecast">
        <div class="forecast__header">Forecasts</div>
        <div class="forecast__divider"></div>
        <div class="forecast__display" ref="display"></div>
    </section>
</template>

<script>
    import * as Plot from "@observablehq/plot"
import nprogress from "nprogress"
    export default {
        data() {
            return {
                dates: [],
                tickets: null,
                trainingData: [],
                chartInput: [],
                countObj: {},
                maxOutput: null,
                dayReference: {}
            }
        },
        computed: {
            plot() {
                const nnPlot = Plot.plot({
                    y: {
                        grid: true
                    },
                    marks: [
                        Plot.line(this.chartInput, {x: "Date", y: "Count"})
                    ]
                })
                console.log(nnPlot)
                return nnPlot
            }
        },
        methods: {
            getAllDates(startDate, endDate) {
                const start = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0))
                const end = new Date(new Date(endDate).setUTCHours(0, 0, 0, 0))

                const date = new Date(start.getTime())

                while (date <= end) {
                    let newDate = new Date(date)
                    this.dates.push(newDate.toISOString())
                    date.setDate(date.getDate() + 1)
                }
            },
            getMonthsAndDays() {
                this.getAllDates("2022-01-01T00:00:00.000Z", "2022-12-31T00:00:00.000Z")
                const newDates = []
                this.dates.forEach(date => {
                    newDates.push(date.substring(5, 10))
                })
                this.dates = newDates
            },
            // train() {
            //     const net = new brain.NeuralNetwork()

            //     const trainingData = [
            //         { input: [0, 0], output: [0] },
            //         { input: [0, 1], output: [1] },
            //         { input: [1, 0], output: [1] },
            //         { input: [1, 1], output: [0] },
            //     ]

            //     net.train(trainingData)
            //     const result = net.run([0, 0])
            //     console.log(result[0])
            // },
            getRandomNumber(min, max) {
                min = Math.ceil(min)
                max = Math.floor(max)
                return Math.floor(Math.random() * (max - min + 1)) + min
            },
            async getAllTickets() {
                try {
                    let response = await fetch("http://localhost:3333/api/ticket", {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Authorization': 'Bearer ' + this.$store.getters.token,
                            'Content-Type': 'application/json'
                        }
                    })
                    response = await response.json()
                    this.tickets = response
                } catch(error) {
                    console.log(error)
                }
            },
            getOutputRange(month) {
                // around 10 percent
                if (month <= 3/12) {
                    const outputRange = {
                        lowerLimit: 1,
                        upperLimit: 20
                    }
                    return outputRange
                // around 50 to 80 percent
                } else if (month > 3/12 && month <= 6/12) {
                    const outputRange = {
                        lowerLimit: 100,
                        upperLimit: 180
                    }
                    return outputRange
                // around 30 to 50 percent
                } else if (month > 6/12 && month <= 9/12) {
                    const outputRange = {
                        lowerLimit: 60,
                        upperLimit: 100
                    }
                    return outputRange
                } else {
                // around 10 to 20 percent
                    const outputRange = {
                        lowerLimit: 20,
                        upperLimit: 40
                    }
                    return outputRange
                }
            },
            getTrainingData() {
                const data = []
                
                
                for (let i = 0; i < 1000; i++) {
                    
                    const randomMonth = (1 / 12) * this.getRandomNumber(1, 12)
                    const randomDay = (1 / 31) * this.getRandomNumber(1, 31)
                    const outputRange = this.getOutputRange(randomMonth)
                    const randomOutput = (1 / 200) * this.getRandomNumber(outputRange.lowerLimit, outputRange.upperLimit)

                    data.push({
                        input: [randomMonth, randomDay],
                        output: [randomOutput]
                    })
                }

                this.trainingData = data

            },
            getChartInput() {
                this.getTrainingData()

                const net = new brain.NeuralNetwork()
                const trainingData = this.trainingData
                console.log(trainingData)
                const output = net.train(trainingData)
                console.log(output)
                

                this.dates.forEach(date => {
                    const result = net.run([parseInt(date.substring(0, 2)) / 12, parseInt(date.substring(3, 5)) / 31])
                    const updatedDate = '2022-' + date
                    this.chartInput.push({
                        Date: updatedDate,
                        Count: result[0] * 200
                    })
                })
            },
            getPlot() {
                const nnPlot = Plot.plot({
                    x: {
                        type: "utc"
                    },
                    y: {
                        grid: true
                    },
                    marks: [
                        Plot.line(this.chartInput, {x: "Date", y: "Count"})
                    ],
                    width: 900,
                    height: 562.5
                })
                this.$refs.display.appendChild(nnPlot)
            }
        },
        created() {
            this.getMonthsAndDays()
            this.getChartInput()
        },
        mounted() {
            this.getPlot()
        }
    }
</script>
<style scoped>
    .forecast {
        width: 900px;
    }
    .forecast__header {
        font-size: 2rem;
        font-weight: 700;
        padding: 1rem 0rem;
    }
    .forecast__divider {
        width: 100%;
        height: 1px;
        background-color: var(--neutral-200);
    }
    .forecast__display {
        width: 900px;
        height: 600px;
    }
</style>