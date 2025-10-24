const generate = async (assessmentType) => {
    console.log('start generating assessment ' + assessmentType)
    try {
      const data = {
          assessmentType: assessmentType,
	      guidesContent: 'Make Python Great Again',
	      filesList: [{"path":"run.sh", "content":"#!/bin/bash while true; do python3 done"}],
	      userIntro:"python print"
      }
      const result = await window.codioIDE.guides.assessments.generate(data)
      console.log('successfully generated', result)
      console.log('saving assessment')
      await window.codioIDE.guides.assessments.save(result.assessment, result.files)
      console.log('successfully saved')
    } catch (e) {
        console.error(e)
    }
}

const assessmentsStyle = `
    width: 140px;
    height: 110px;
    z-index: 10000;
    position: absolute;
    left: 200px;
    top: 600px;
    background-color: white;
    padding: 10px;
`
const createButton = (title, onClick) => {
  const button = document.createElement('button')
  button.type = 'button'
  button.innerHTML = title
  button.onclick = onClick
  return button
}

const makeDraggable = (el) => {
  let offsetX = 0, offsetY = 0, isDown = false

  el.addEventListener('mousedown', (e) => {
    isDown = true
    offsetX = e.clientX - el.offsetLeft
    offsetY = e.clientY - el.offsetTop
    el.style.cursor = 'grabbing'
  })

  document.addEventListener('mouseup', () => {
    isDown = false
    el.style.cursor = 'grab'
  })

  document.addEventListener('mousemove', (e) => {
    if (!isDown) return
    el.style.left = (e.clientX - offsetX) + 'px'
    el.style.top = (e.clientY - offsetY) + 'px'
  })
}

const initAssessments = () => {
    const modal = document.createElement('div')
    modal.id = 'generateAssessmentsModalId'
    modal.style = assessmentsStyle
    const types = ["free-text", "parsons-puzzle", "multiple-choice", "fill-in-the-blanks", "code-output-compare"];
    modal.append(createButton('Free text', async () => generate(types[0])))
    modal.append(createButton('Parsons', async () => generate(types[1])))
    modal.append(createButton('Multichoice', async () => generate(types[2])))
    modal.append(createButton('Fill in the blanks', async () => generate(types[3])))
    modal.append(createButton('Standard code test', async () => generate(types[4])))
    modal.append(createButton('Several randomly', async () => {
        for (let i = 0; i < 5; i++) {
            generate(types[i])
        }        
    }))
  	makeDraggable(modal)
  	document.body.append(modal)
}

setTimeout(initAssessments, 100)
