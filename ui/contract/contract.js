export function handle(state, action) { 
    
    if (action.input.function === 'init') { 
        state.user = action.caller
    }

    if (action.input.function === 'createImage') {
        const images = state.images
        images[action.input.image.id] = action.input.image
        state.images = images
    }

    

    return {
        state
    }
}