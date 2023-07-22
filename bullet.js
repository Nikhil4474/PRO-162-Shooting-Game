AFRAME.registerComponent("bullets", {
  init: function () {
    this.shootBullet()
  },
  shootBullet: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === "e") {
        var bullet = document.createElement("a-entity")

        bullet.setAttribute("visible", true)
        

        bullet.setAttribute("geometry", {
          primitive: "sphere",
          radius: 0.1,
        })

        bullet.setAttribute("material", "color", "black")

        var cam = document.querySelector("#camera")

        pos = cam.getAttribute("position")

        bullet.setAttribute("position", {
          x: pos.x,
          y: pos.y,
          z: pos.z,
        })

        var camera = document.querySelector("#camera").object3D

        //get the camera direction as Three.js Vector
        var direction = new THREE.Vector3()
        camera.getWorldDirection(direction)

        //set the velocity and it's direction
        bullet.setAttribute("velocity", direction.multiplyScalar(-10))

        var scene = document.querySelector("#scene")
        bullet.setAttribute("dynamic-body", {shape:"sphere", ma:0})
        bullet.addEventListener("collide", this.removeBullet)
        // bullet.addEventListener("collide", this.removeWall)
        bullet.addEventListener("collide", this.changeWallCol)
        scene.appendChild(bullet)
      }
    })
  },

  removeBullet: function (e) {
    //Original entity (bullet)
    console.log(e.detail.target.el)

    //Other entity, which bullet touched.
    console.log(e.detail.body.el)

    //bullet element
    var element = e.detail.target.el

    //element which is hit
    var elementHit = e.detail.body.el
    if (elementHit.id.includes("box")) {
      element.setAttribute("visible", false)
      elementHit.setAttribute("material", {opacity:1, transparent:true})
      var impulse = new CANNON.Vec3(1,1,1)
      var elementHitPos = new CANNON.Vec3().copy(elementHit.getAttribute("position"))
      elementHit.body.applyImpulse(impulse, elementHitPos)
      element.removeEventListener("collide", this.shootBullet)
      var scene = document.querySelector("#scene")
      scene.removeChild(element)
    }
  },


  removeWall: function(e){
    var element = e.detail.target.el

    //element which is hit
    var elementHit = e.detail.body.el

    if (elementHit.id.includes("wall2")){
      element.setAttribute("visible", false)
      elementHit.setAttribute("material", {opacity:0, transparent:true})
      element.removeEventListener("collide", this.shootBullet)
      var scene = document.querySelector("#scene")
      scene.removeChild(element)
    }
  },


  changeWallCol: function(e){
    var colors = ["red", "green", "blue", "yellow", "black", "white"]
    var element = e.detail.target.el

    var elementHit = e.detail.body.el

    if(elementHit.id.includes("wall1") || elementHit.id.includes("wall2") || elementHit.id.includes("wall3") || elementHit.id.includes("wall4") || elementHit.id.includes("wall5") || elementHit.id.includes("wall6") || elementHit.id.includes("wall7")){
      elementHit.setAttribute("material", {color: colors[Math.floor(Math.random() * colors.length)]})
    }
  }
})
