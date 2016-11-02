"use strict"

document.addEventListener("DOMContentLoaded", function() {
    let paused = false
    let canvas = document.getElementById("galaxy")
    let ctx = canvas.getContext("2d")
    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight
    let stars = []

    // Helpers
    let randomRange = (min, max) => min + Math.random() * (max - min)
    let degreesToRads = (degrees) => degrees / 180 * Math.PI
    let starSizes = () => randomRange(0.2, 0.9)

    // Configuration
    let starRadius = 3
    let starSpeed = 0.2
    let starCount = randomRange(100, 300)
    let starDirection = 145

    // Star Generator
    let starColours = () => {
        let colours = [
            "188, 236, 201", // green/white   - Type W & O
            "188, 227, 236", // blue          - Type B
            "255, 255, 255", // white         - Type A
            "247, 250, 181", // yellow/white  - Type F
            "233, 220, 105", // yellow        - Type G (Sun)
            "232, 198, 62",  // orange        - Type K
            "232, 152, 62",  // orange/red    - Type M
            "232, 70, 62"    // red           - Type N & S
        ]

        return colours[Math.floor(Math.random() * colours.length)]
    }

    let star = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius: 0,
        opacity: undefined,
        colour: undefined,
        trail: undefined,

        create: function(x, y, speed, direction) {
            let star = Object.create(this)
                star.x = x
                star.y = y
                star.vx = Math.cos(direction) * speed
                star.vy = Math.sin(direction) * speed
                star.opacity = Math.random()
                star.colour = starColours()
                star.trail = randomRange(0, 10)
            return star
        },

        getSpeed: function() {
            return Math.sqrt(this.vx * this.vx + this.vy * this.vy)
        },

        getDirection: function() {
            return Math.atan2(this.vy, this.vx)
        },

        setDirection: function(heading) {
            let speed = this.getSpeed()
            this.vx = Math.cos(heading) * speed
            this.vy = Math.sin(heading) * speed
        },

        setSpeed: function(speed) {
            let heading = this.getDirection()
            this.vx = Math.cos(heading) * speed
            this.vy = Math.sin(heading) * speed
        },

        update: function() {
            this.x += this.vx
            this.y += this.vy
        }
    }

    // Create Star
    for (let i = 0; i < starCount; i += 1) {
        let hashi = star.create(randomRange(0, width), randomRange(0, height), 0, 0)
            hashi.radius = starRadius * starSizes()
            hashi.setSpeed(starSpeed)
            hashi.setDirection(degreesToRads(starDirection))
        stars.push(hashi)
    }

    // Draw Star
    let drawStar = (star) => {
        ctx.fillStyle = `rgba(${star.colour}, ${star.opacity})`
        ctx.shadowBlur = star.trail
        ctx.shadowColor = `rgba(${star.colour}, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false)
        ctx.fill()

        ctx.shadowBlur = 0
    }

    // Draw Scene
    let update = () => {
        if (!paused) {
            ctx.clearRect(0, 0, width, height)

            let blueCloud = ctx.createRadialGradient(0, 0, width / 4, width / 2, height / 2, 2000)
                blueCloud.addColorStop(0, "#495B9A")
                blueCloud.addColorStop(1, "rgba(0,0,0,0)")
            ctx.fillStyle = blueCloud
            ctx.fillRect(0, 0, width, height)

            let purpleCloud = ctx.createRadialGradient(width, height - 200, width / 2, width / 2, height / 2, 2000)
                purpleCloud.addColorStop(0, "#2C253C")
                purpleCloud.addColorStop(1, "rgba(0,0,0,0)")
            ctx.fillStyle = purpleCloud
            ctx.fillRect(0, 0, width, height)

            /*let comet = ctx.createRadialGradient(width, height, 200, 10, 10, 10)
                comet.addColorStop(0, "#90D3DA")
                comet.addColorStop(1, "rgba(0,0,0,0)")
            ctx.fillStyle = comet
            ctx.fillRect(0, 0, width, height)*/

            ctx.fill()

            for (let i = 0; i < stars.length; i += 1) {
                let hashi = stars[i]

                hashi.update()
                drawStar(hashi)

                if (hashi.x > width) hashi.x = 0
                if (hashi.x < 0) hashi.x = width
                if (hashi.y > height) hashi.y = 0
                if (hashi.y < 0) hashi.y = height
            }
        }

        window.requestAnimationFrame(update)
    }

    // Run
    update()

    window.onfocus = () => {
        paused = false
    }

    window.onblur = () => {
        paused = true
    }
}, false)
