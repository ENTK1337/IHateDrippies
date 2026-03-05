#version 120

const float PIXELATE_STRENGTH = 4.0;
const float OUTLINE_WIDTH = 0.1;

uniform sampler2D texSampler;
uniform float screenSizeX;
uniform float screenSizeY;

uniform vec4 outlineC = vec4(0.0, 0.0, 0.0, 1.0);

vec4 pixelate(vec2 uv, vec2 texel) {
    vec2 q = texel * PIXELATE_STRENGTH;
    uv = floor(uv / q) * q;
    return texture2D(texSampler, uv);
}

vec4 gameboyPalette(vec4 color) {
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    
    if (gray > 0.75) {
        gray = 1.0;
    } else if (gray > 0.5) {
        gray = 0.75;
    } else if (gray > 0.25) {
        gray = 0.5;
    } else {
        gray = 0.25;
    }
    
    vec3 greenTint = vec3(0.3, 0.6, 0.3);
    return vec4(gray * greenTint, color.a);
}

void main(void) {
    vec2 texCoord = gl_TexCoord[0].xy;
    vec2 texel = vec2(1.0 / screenSizeX, 1.0 / screenSizeY);

    vec4 pixelatedColor = pixelate(texCoord, texel);
    pixelatedColor = gameboyPalette(pixelatedColor);

    vec2 q = texel * PIXELATE_STRENGTH;
    vec2 uv_mod = mod(texCoord, q) / q;
    if (uv_mod.x < OUTLINE_WIDTH || uv_mod.y < OUTLINE_WIDTH || uv_mod.x > 1.0 - OUTLINE_WIDTH || uv_mod.y > 1.0 - OUTLINE_WIDTH) {
        gl_FragColor = outlineC;
    } else {
        gl_FragColor = pixelatedColor;
    }
}
