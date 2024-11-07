import OpenAI from 'openai'
import { envServer } from '~/env/server'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'
import { HttpsProxyAgent } from 'https-proxy-agent'

const proxyUrl = 'http://127.0.0.1:7890'
const proxyAgent = new HttpsProxyAgent(proxyUrl)

const openai = new OpenAI({
  apiKey: envServer.OPENAI_API_KEY,
  httpAgent: proxyAgent,
})

const analyzeNationAndSkillsSchema = z.object({
  user_info: z.object({
    country: z.string(),
    credibility: z.number(),
  }),
  expertise_fields: z.array(
    z.object({
      field: z.string(),
      proficiency: z.array(
        z.object({
          field: z.string(),
          level: z.number(),
        }),
      ),
    }),
  ),
})

export const inferNationAndSkills = async (text: string) => {
  await new Promise((resolve) => setTimeout(resolve, 5000))
  try {
    // return {
    //   user_info: {
    //     country: 'China',
    //     credibility: 5,
    //   },
    //   expertise_fields: [
    //     {
    //       field: 'Front end development',
    //       proficiency: [
    //         {
    //           field: 'Next.js',
    //           level: 5,
    //         },
    //         {
    //           field: 'React',
    //           level: 5,
    //         },
    //         {
    //           field: 'Vue.js',
    //           level: 5,
    //         },
    //       ],
    //     },
    //     {
    //       field: 'Backend development',
    //       proficiency: [
    //         {
    //           field: 'Spring Boot',
    //           level: 3,
    //         },
    //         {
    //           field: 'Node.js',
    //           level: 5,
    //         },
    //         {
    //           field: 'Next.js API',
    //           level: 5,
    //         },
    //       ],
    //     },
    //     {
    //       field: 'CI/CD',
    //       proficiency: [
    //         {
    //           field: 'Github Action',
    //           level: 3,
    //         },
    //       ],
    //     },
    //   ],
    // }
    const response = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: 'Analyze the provided text (which contains two parts: Date information and Readme text). The task consists of two sub-tasks: first, infer the user\'s possible country and credibility based on Date active time zone and Readme text information; second, analyze the fields that the user may have expertise in through the Readme text and return a list of corresponding tags representing their areas of expertise and the degree of proficiency.\n\n# Steps\n\n1. **Identify and Extract Date Information**:\n   - Identify and extract the Date information from the provided text.\n   - Parse the Date\'s format to ensure proper identification of year, month, and day.\n   - Determine the possible active time zone based on the given Date information.\n\n2. **Determine User\'s Location and Credibility**:\n   - Use the active time zone derived from the Date to infer the user\'s likely country and use two-letter country codes.\n   - Gather additional geographical or cultural hints from the Readme text to assist in determining the probable location.\n   - **Assess User Credibility**:\n     - Evaluate credibility based on both the content and writing style of the Readme text:\n       - **Linguistic Analysis**: Consider grammatical consistency, tone, and clarity of the language to determine credibility.\n       - **Content Depth**: Evaluate whether the Readme provides thorough explanations, showcases domain knowledge, or includes clear, detailed statements.\n     - Assign a credibility score on a scale from 0-5 (0: very untrustworthy, 5: very trustworthy).\n\n3. **Analyze Readme Content for Areas of Expertise**:\n   - **Identify Expertise Areas**: Analyze the Readme section to identify any specific technologies, domains, or expertise areas.\n   - **Determine Skill Proficiency by Field and Technology**:\n     - Group the identified skills into specific fields (e.g., frontend development, backend development).\n     - Assign a proficiency level to each skill (L0-L5):\n       - L0: Completely unfamiliar\n       - L1-L2: Basic understanding / beginner\n       - L3-L4: Intermediate / developing expertise\n       - L5: Highly proficient / expert knowledge.\n     - Structure each field with related technology stacks, showing individual proficiencies for each.\n\n# Output Format\n\nThe output should include:\n\n1. **User Location and Credibility**:\n   - `"country"`: The inferred country based on provided data and time zone analysis.\n   - `"credibility"`: A numerical rating of the user’s credibility from 0 to 5.\n\n2. **Areas of Expertise**:\n   - A list of fields (e.g., machine learning, front-end development) and associated proficiency levels.\n   - Format the output as follows:\n\n```json\n{\n  "user_info": {\n    "country": "[Inferred country]",\n    "credibility": [0-5]\n  },\n  "expertise_fields": [\n    {\n      "field": "[Field name]",\n      "proficiency": [\n        {\n           "field": "[skill_tag]"\n           "level": "L0-L5"\n        },\n        {\n           "field": "[skill_tag]"\n           "level": "L0-L5"\n        },\n      ]\n    },\n    {\n      "field": "[Field name]",\n      "level": "L0-L5"\n      "proficiency": [\n        {\n           "field": "[skill_tag]"\n           "level": "L0-L5"\n        },\n        {\n           "field": "[skill_tag]"\n           "level": "L0-L5"\n        },\n      ]\n    },\n  ]\n}\n```\n\n# Examples\n\n**Input**:\n```\nDate: March 15, 2023\nReadme: "I have been working with Java and SpringBoot mainly, but I am shifting my focus to front-end development with React."\n```\n\n**Output**:\n```json\n{\n  "user_info": {\n    "country": "US",\n    "credibility": 3\n  },\n  "expertise_fields": [\n    {\n      "field": "backend development",\n      "proficiency": [\n        {\n          "field": "SpringBoot",\n          "level": "L5"\n        },\n        {\n          "field": "Flask",\n          "level": "L3"\n        }\n      ]\n    },\n    {\n      "field": "front-end development",\n      "proficiency": [\n        {\n          "field": "Next.js",\n          "level": "L5"\n        },\n        {\n          "field": "React",\n          "level": "L5"\n        }\n      ]\n    }\n  ]\n}\n```\n\n*(Note: Real examples should have more extensive readme content that may refer to multiple skill areas, hence resulting in more diverse expertise fields and proficiency ratings.)*\n\n# Notes\n\n- **Date Formats**: Date information must support multiple formats (e.g., "YYYY年MM月DD日", "MM/DD/YYYY", or "Month DD, YYYY").\n- **Inference Context**: Use cultural references, common expressions, or technical terminology to infer the user\'s region.\n- **Credibility Scale Justification**: Provide additional reasoning for each credibility rating to support transparency.\n- **Skill Matching Cues**: Look for specific keywords, technologies, and contextual cues that demonstrate the user\'s familiarity or level of expertise within different domains.\n',
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: text,
            },
          ],
        },
      ],
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: zodResponseFormat(analyzeNationAndSkillsSchema, 'analyze_response'),
    })

    const analyze_response = response.choices[0]?.message
    console.log(analyze_response)
    if (analyze_response?.parsed) {
      console.log(analyze_response.parsed)
      return analyze_response.parsed
    } else if (analyze_response?.refusal) {
      // handle refusal
      console.log(analyze_response.refusal)
      return analyze_response.parsed
    }
  } catch (e) {
    // Handle edge cases
    if (e?.constructor.name == 'LengthFinishReasonError') {
      // Retry with a higher max tokens
      // @ts-ignore
      console.log('Too many tokens: ', e.message)
    } else {
      // Handle other exceptions
      // @ts-ignore
      console.log('An error occurred: ', e.message)
      console.log(e)
    }
  }
}
