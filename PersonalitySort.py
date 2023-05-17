# import csv
import sys


def assign_mbti(job_description):
    extroversion = ["communication", "leadership", "teamwork", "sales", "marketing", "public speaking", "team", "collaboration", "outgoing", "socializing"]
    introversion = ["research", "writing", "analytical", "creative", "strategic", "independently", "reflection", "reserved", "thoughtful"]
    sensing = ["detail", "practical", "technical", "observational", "efficient", "observant", "realistic", "hands-on", "concrete"]
    intuitive = ["creative", "strategic", "innovative", "insightful", "visionary", "imaginative", "abstract", "conceptual"]
    thinking = ["critical", "solve", "decisive", "strategic", "technical", "problem-solving", "logical", "analytical", "objective", "rational", "impartial"]
    feeling = ["empathetic", "communication", "resolution", "leadership", "creative", "compassionate", "emotional", "subjective", "harmonious"]
    judging = ["planning", "organization", "time management", "decisive", "detail", "accountable", "detail-oriented", "structured", "scheduled", "systematic", "orderly"]
    perceiving = ["adaptable", "adaptability", "creative", "problem solving", "solve", "flexible", "exploration", "open-minded", "spontaneous", "curious"]
    job_description = job_description.replace(":", "")
    job_description = job_description.replace(",", "")
    job_description = job_description.replace(".", "")
    job_description = job_description.lower().split()
    mbti = None

    # Check for Introversion/Extroversion
    introversion_count = 0
    extroversion_count = 0
    for word in job_description:
        if word in introversion:
            introversion_count += 1
        if word in extroversion:
            extroversion_count += 1
    print(introversion_count)
    print(extroversion_count)
    if introversion_count > extroversion_count:
        mbti = 'I'
    else:
        mbti = 'E'

    # Check for Sensing/Intuition
    sensing_count = 0
    intuition_count = 0
    for word in job_description:
        if word in sensing:
            sensing_count += 1
        if word in intuitive:
            intuition_count += 1
    print(sensing_count)
    print(intuition_count)
    if sensing_count > intuition_count:
        mbti += 'S'
    else:
        mbti += 'N'

    # Check for Thinking/Feeling
    thinking_count = 0
    feeling_count = 0
    for word in job_description:
        if word in thinking:
            thinking_count += 1
        if word in feeling:
            feeling_count += 1
    print(thinking_count)
    print(feeling_count)
    if thinking_count > feeling_count:
        mbti += 'T'
    else:
        mbti += 'F'

    # Check for Judging/Perceiving
    judging_count = 0
    perceiving_count = 0
    for word in job_description:
        if word in judging:
            judging_count += 1
        if word in perceiving:
            perceiving_count += 1
    print(judging_count)
    print(perceiving_count)
    if judging_count > perceiving_count:
        mbti += 'J'
    else:
        mbti += 'P'
    return mbti


# def loop_through_jobs():
#     jobs_with_mbti = []
#     rownum = 0
#     with open('v6_150results.csv', newline='', encoding='utf-8') as csvfile:
#         reader = csv.DictReader(csvfile)
#         for row in reader:
#             # field_value = row['JobTitle']
#             # print(field_value)
#             jobs_with_mbti.append(tuple((rownum, row['title'], row['salary'],
#                                          assign_mbti(row['job description']))))
#             rownum += 1
#     return jobs_with_mbti


# def sort_priority_order(jobs_with_mbti, personality):
#     sorted_list = []
#     mbti_types = {"INFP": [], "ESTJ": [], "INTJ": [], "ENFP": [], "ISFP": [], "ENTJ": [], "ISTP": [], "ENFJ": [],
#                   "ESFP": [], "ISTJ": [], "INFJ": [], "ESTP": [], "ESFJ": [], "ENTP": [], "ISFJ": [], "INTP": []}

#     priority_order = {
#         "INTJ": ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP",
#                  "ISFP", "ESTP", "ESFP"],
#         "INTP": ["INTP", "INTJ", "ENTP", "ENTJ", "INFP", "INFJ", "ENFP", "ENFJ", "ISTP", "ISFP", "ESTP", "ESFP", "ISTJ",
#                  "ISFJ", "ESTJ", "ESFJ"],
#         "ENTJ": ["ENTJ", "INTJ", "ENTP", "INTP", "ENFJ", "INFJ", "ESTJ", "ISTJ", "ESTP", "ISTP", "ESFJ", "ISFJ", "ESFP",
#                  "ISFP", "ENFP", "INFP"],
#         "ENTP": ["ENTP", "INTP", "ENTJ", "INTJ", "ENFP", "INFP", "ENFJ", "INFJ", "ESTP", "ISTP", "ESTJ", "ISTJ", "ESFP",
#                  "ISFP", "ESFJ", "ISFJ"],
#         "INFJ": ["INFJ", "INTJ", "INFP", "INTP", "ENFJ", "ENTJ", "ENFP", "ENTP", "ISFJ", "ISTJ", "ESFJ", "ESTJ", "ISFP",
#                  "ISTP", "ESFP", "ESTP"],
#         "INFP": ["INFP", "INFJ", "INTP", "INTJ", "ENFP", "ENFJ", "ENTP", "ENTJ", "ISFP", "ISFJ", "ISTP", "ISTJ", "ESFP",
#                  "ESFJ", "ESTP", "ESTJ"],
#         "ENFJ": ["ENFJ", "INFJ", "ENFP", "INFP", "ENTJ", "INTJ", "ENTP", "INTP", "ESFJ", "ISFJ", "ESFP", "ISFP", "ESTJ",
#                  "ISTJ", "ESTP", "ISTP"],
#         "ENFP": ["ENFP", "INFP", "ENFJ", "INFJ", "ENTP", "INTP", "ENTJ", "INTJ", "ESFP", "ISFP", "ESFJ", "ISFJ", "ESTP",
#                  "ISTP", "ESTJ", "ISTJ"],
#         "ISTJ": ["ISTJ", "ESTJ", "ISFJ", "ESFJ", "ISTP", "ESTP", "ISFP", "ESFP", "INTJ", "ENTJ", "INFJ", "ENFJ", "INTP",
#                  "ENTP", "INFP", "ENFP"],
#         "ISFJ": ["ISFJ", "ESFJ", "ISTJ", "ESTJ", "ISFP", "ESFP", "ISTP", "ESTP", "INFJ", "ENFJ", "INFP", "ENFP", "INTP",
#                  "ENTP", "INTJ", "ENTJ"],
#         "ESTJ": ["ESTJ", "ISTJ", "ENTJ", "INTJ", "ESTP", "ISTP", "ENFJ", "INFJ", "ESFJ", "ISFJ", "ENTP", "INTP", "ENFP",
#                  "INFP", "ESFP", "ISFP"],
#         "ESFJ": ["ESFJ", "ISFJ", "ESTJ", "ISTJ", "ESFP", "ISFP", "ESTP", "ISTP", "ENFJ", "INFJ", "ENFP", "INFP", "ENTJ",
#                  "INTJ", "ENTP", "INTP"],
#         "ISTP": ["ISTP", "ESTP", "INTP", "ENTP", "ISTJ", "ESTJ", "ISFP", "ESFP", "INTJ", "ENTJ", "INFJ", "ENFJ", "INFP",
#                  "ENFP", "ISFJ", "ESFJ"],
#         "ISFP": ["ISFP", "ESFP", "INFP", "ENFP", "ISFJ", "ESFJ", "ISTP", "ESTP", "INFJ", "ENFJ", "INTJ", "ENTJ", "ISTJ",
#                  "ESTJ", "INTP", "ENTP"],
#         "ESTP": ["ESTP", "ISTP", "ESFP", "ISFP", "ESTJ", "ISTJ", "ENTP", "INTP", "ENFP", "INFP", "ENTJ", "INTJ", "ESFJ",
#                  "ISFJ", "ENFJ", "INFJ"],
#         "ESFP": ["ESFP", "ISFP", "ENFP", "INFP", "ESTP", "ISTP", "ESFJ", "ISFJ", "ESTJ", "ISTJ", "ENFJ", "INFJ", "ENTP",
#                  "INTP", "ENTJ", "INTJ"]
#     }
#     for job in jobs_with_mbti:
#         mbti_types[job[3]].append(job)
#     for mbti in priority_order[personality]:
#         sorted_list.extend(mbti_types[mbti])
#     return sorted_list


# Get the job description from the command-line argument
job_description = sys.argv[1]

# Perform the MBTI calculation
mbti_result = assign_mbti(job_description)

# Output the MBTI result
print(mbti_result)
